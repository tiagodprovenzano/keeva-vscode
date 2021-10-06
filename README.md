# Keeva

Keeva is a template language that allows the creation of complex templates to use with any language you desire. To use this extension please follow these steps.

## Initiate Keeva. 

Go to the desired project and initiate using the command "Keeva init".

Press `shif` + `ctrl` + `P` and look for `"Keeva init"`

This will create a `keeva.config.json` config file on your project root.

## Create a template

Go to the `.keeva/templates` dir and create a dir with any name you wish, in this example we will create the `components` folder.

Inside it create a `component.kva` file.

This extension comes with syntax highlighting for .kva (keeva) files; 

On your `component.kva` file add the content:

```
@FILENAME=<%filename%>
@EXT=ts

console.log("<%content%>")

```

The `<%VARIABLE_NAME%>` notation is how keeva sees the variables you are using for each file. You can add as many as variables as you wish on your templates.

## Register the template type

On your `keeva.config.json` add the following to you methods array: 

```json
{
    "methods": [
        //...other methods
        {
            "name": "My Components",
            "folder": "components"
        }
    ]
}
```

Now Keeva will know where to look for your new components templates.

## Use your template

Right click on the folder you wish your template files to be created at and chose the option `Keeva create...`

Vscode will prompt you what kind of template you wish to create. After you chose 'My Component' it will prompt you to add the variables to be used, in this case a string like this:

```
filename=HelloWorld content=Its a file!
```

Keeva will create a `HelloWorld.ts` file on the dir you chose with the content:

```ts
console.log("Its a file!")
```

## Kebab case

Keeva has a built in function to change from camelCase to kebab style case. 

It will transform a variable like `ComponentListItem` to `component-list-item`

To use this use the notation `<%KEBAB|VARIABLE_NAME%>`

in the previous example, if we had our .kva content like:

```
@FILENAME=<%KEBAB|filename%>
@EXT=ts

console.log("<%content%>")
```

And used the `Keeva create...` command with the same values, it would produce a `hello-world.ts` file with the content:

```ts
console.log("Its a file!")
```

## Variable names can be used on dir names

Say you want to have a more complex template with different files and dir. Lets edit the `.keeva/templates` folder to the following:

```
-templates/
    -components/
        -<%name%>/
        -<%KEBAB|name%>/
```

When we use the `Keeva create...` command with `name=FolderName`

the following structure will be created:

```
-templates/
    -components/
        -FolderName/
        -folder-name/
```

You can have as many folder levels inside your template. If the folder doesn't exist, keeva will create it, if it does exist keeva will add the files to the existing folder.