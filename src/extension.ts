// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {
  create,
  ConfigFile,
  TemplateVariables,
  validateInputText,
} from '@tiagodprovenzano/react-keeva/';
import * as fs from 'fs';
import * as path from 'path';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "react-keeva-vs" is now active!',
  );
  let init = vscode.commands.registerCommand('react-keeva-vs.init', () => {
    console.log(vscode.workspace.workspaceFolders);
    const workspaceFolder =
      vscode.workspace.workspaceFolders?.[0].uri.path.replace(/.*:/, '');
    let workspaceFolderPath = '';
    if (workspaceFolder) {
      workspaceFolderPath = workspaceFolder;
      ConfigFile.init(workspaceFolderPath);
      vscode.window.showInformationMessage('Success');
    }
  });

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'react-keeva-vs.create',
    (uri: vscode.Uri) => {
      const workspaceFolders =
        vscode.workspace.workspaceFolders?.[0].uri.path.replace(/.*:/, '');
      let workspaceFolderPath = '';
      if (Array.isArray(workspaceFolders) && workspaceFolders?.[0]) {
        workspaceFolderPath = workspaceFolders[0];
      } else {
        workspaceFolderPath = workspaceFolders as string;
      }
      const config = new ConfigFile(workspaceFolderPath);
      const picks: vscode.QuickPickItem[] = config.methods.map(item => ({
        label: item.name,
      }));

      vscode.window.showQuickPick(picks, { canPickMany: false }).then(pick => {
        console.log({ pick });
        const command = config.methods.find(i => i.name === pick?.label);
        const commandDir = command?.folder || command?.name;
        if (!commandDir) {
          vscode.window.showErrorMessage(
            'Command not folder not found in keeva.config.json',
          );
          return;
        }
        const templateDir: string = path.join(config.templateUri, commandDir);
        const isTemplateFolderAvailable = fs.existsSync(templateDir);
        if (!isTemplateFolderAvailable) {
          vscode.window.showErrorMessage(
            'There are no templates to this file types. Aborting',
          );
          return;
        }
        if (commandDir) {
          // @ts-ignore
          const variables = new TemplateVariables(templateDir).variables;
          vscode.window
            .showInputBox({
              title: `Please use the pattern: [VARIABLE_NAME]=[VALUE]. Variables for ${
                command.name
              } are: <br/>${variables.join()}.`,
              placeHolder: variables.map(i => i + '=? ').join(' '),
            })
            .then((variablesInput: string | undefined) => {
              console.log(variablesInput, commandDir);
              if (variablesInput) {
                const isInputTextValid = validateInputText(
                  variables,
                  variablesInput,
                );
                if (!isInputTextValid.valid) {
                  return vscode.window.showErrorMessage(
                    'Aborting.\nMissing values for: ' +
                      isInputTextValid.missingVariables.join(','),
                    '',
                  );
                }
                try {
                  create(
                    workspaceFolderPath,
                    uri.fsPath,
                    commandDir,
                    variablesInput,
                  );
                  vscode.window.showInformationMessage('Success');
                } catch (error) {
                  console.log('====================================');
                  console.log(error);
                  console.log('====================================');
                }
              }
            });
        }
      });
    },
  );

  context.subscriptions.push(disposable, init);
}

// this method is called when your extension is deactivated
export function deactivate() {}
