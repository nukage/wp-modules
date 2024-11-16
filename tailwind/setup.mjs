import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import { input, select} from "@inquirer/prompts"; // Importing 'input' from @inquirer/prompts

const execPromise = promisify(exec);

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'dist');
const destDir = path.join(__dirname, '..', '..', '..');

function copyFiles(src, dest) {
    fs.readdir(src, (err, files) => {
        if (err) {
            return console.error(`Unable to scan directory: ${err}`);
        }

        files.forEach(file => {
            const srcFile = path.join(src, file);
            const destFile = path.join(dest, file);

            fs.stat(srcFile, (err, stats) => {
                if (err) {
                    return console.error(`Unable to stat file: ${err}`);
                }

                if (stats.isDirectory()) {
                    // Create directory if it does not exist
                    fs.mkdir(destFile, { recursive: true }, (err) => {
                        if (err) {
                            return console.error(`Unable to create directory: ${err}`);
                        }
                        // Recursively copy subdirectory
                        copyFiles(srcFile, destFile);
                    });
                } else {
                    // Copy file
                    fs.copyFile(srcFile, destFile, (err) => {
                        if (err) {
                            return console.error(`Unable to copy file: ${err}`);
                        }
                        console.log(`Copied ${srcFile} to ${destFile}`);
                    });
                }
            });
        });
    });
}

// Function to prompt for installing dependencies
async function promptForDependencies() {
    const response = await select({
        message: "Do you want to install dependencies? (yes/no)",
        choices: ["Yes", "No"],
    });

    if (response.toLowerCase() === 'yes') {
        const dependencies = [
            "github:nukage/tailthemer",
            "@tailwindcss/forms",
            "autoprefixer",
            "browser-sync",
            "browser-sync-webpack-plugin",
            "cross-env",
            "laravel-mix",
            "postcss",
            "postcss-import",
            "postcss-nested",
            "postcss-nested-ancestors",
            "postcss-rem-to-pixel",
            "resolve-url-loader",
            "tailwindcss"
         ];

        const depsString = dependencies.join(' ');
        console.log(`\n Example package-tailwind.json has been added to root folder - copy scripts and dependencies into your own package.json and then delete package-tailwind.json when you're done. \n`);
        // console.log(`\n RUN THIS TO INSTALL DEPENDENCIES: \n npm install ${depsString} \n`);


        try {
            const { stdout, stderr } = await execPromise(`npm install ${depsString}`, { cwd: destDir });
            console.log(`Dependencies installed successfully:\n${stdout}`);
            if (stderr) {
              console.error(`Stderr output:\n${stderr}`);
            }
          } catch (error) {
            console.error(`Error installing dependencies: ${error}`);
          }


        // exec(`npm install ${depsString}`, { cwd: destDir }, (error, stdout, stderr) => {
        //     if (error) {
        //         console.error(`Error installing dependencies: ${error}`);
        //         return;
        //     }
        //     console.log(`Dependencies installed successfully:\n${stdout}`);
        //     if (stderr) {
        //         console.error(`Stderr output:\n${stderr}`);
        //     }
        // });
    } else {
        console.log('Skipping dependencies installation.');
    }
    console.log('Dependencies step is done.');
}

// Start the copy operation
copyFiles(srcDir, destDir);

// Call prompt for dependencies after a short delay
setTimeout(async () => {
    await promptForDependencies(); // Make sure to await this
    console.log("Child script execution completed.");
   process.exit(0); // Exit child process after finishing all execution
}, 1000);