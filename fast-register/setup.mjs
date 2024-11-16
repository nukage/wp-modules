import fs from 'fs';
import { input, select } from '@inquirer/prompts';

const filePath = 'resources/modules/fast-register/js'; // Adjust this path as needed
const cssPath = 'resources/modules/fast-register/css'; // Adjust this path as needed

async function main() {
  if (!fs.existsSync('js')) {

  }

  const jsFiles = fs.existsSync('js') ? fs.readdirSync('js').filter(file => file.endsWith('.js')) : [];
  const cssFiles =  fs.existsSync('css') ?  fs.readdirSync('css').filter(file => file.endsWith('.css')) : [];


  // Check if index.php exists, create it if not
  if (!fs.existsSync('index.php')) {
    fs.writeFileSync('index.php', `<?php
/*
Module Name: Fast Register
Description: This is meant to work with the QNTM setup scripts.
*/

function boilerplate_load_assets() {
  // Registration functions will be added here by the Node script
}

add_action('wp_enqueue_scripts', 'boilerplate_load_assets');
`);
  }

  let indexPhpContent = fs.readFileSync('index.php', 'utf-8');

  // Find the closing brace of the boilerplate_load_assets() function
  let closingBraceIndex = indexPhpContent.lastIndexOf('}');

  for (const file of jsFiles) {
    // const filePath = `js/${file}`;
    const fileName = file.replace('.js', '');

    // Check if the script is already registered in index.php
    if (indexPhpContent.includes(`'${fileName}'`)) {
      console.log(`Script '${fileName}' is already registered.`);
      continue;
    }

    // Ask for the registration name
    const registrationName = await input({
      message: `Enter the registration name for '${fileName}':`,
      default: fileName,
    });

    const answers = await input({
      message: `Enter dependencies for '${registrationName}' (comma-separated):`,
      default: '',
    });

    const enqueuePosition = await select({
        message: `Where should '${registrationName}' be enqueued?`,
        choices: ['header', 'footer'],
      });

    const dependencies = answers.split(',').map(dep => dep.trim());

    // Create the registration code
    const registrationCode = `
    wp_register_script('${registrationName}', get_theme_file_uri('/${filePath}/${file}'), ${JSON.stringify(dependencies)}, '1.0',  ${enqueuePosition === 'header'});
`;

    // Insert the registration code before the closing brace
    indexPhpContent = indexPhpContent.slice(0, closingBraceIndex) + registrationCode + indexPhpContent.slice(closingBraceIndex);

    // Update the closing brace index for the next iteration
    closingBraceIndex += registrationCode.length;

    // Write the modified content back to the file
    fs.writeFileSync('index.php', indexPhpContent);

    console.log(`Script '${fileName}' registered as '${registrationName}' successfully.`);
  }
  for (const file of cssFiles) {
    const fileName = file.replace('.css', '');

    // Check if the style is already registered in index.php
    if (indexPhpContent.includes(`'${fileName}'`)) {
      console.log(`Style '${fileName}' is already registered.`);
      continue;
    }

    // Ask for the registration name
    const registrationName = await input({
      message: `Enter the registration name for '${fileName}':`,
      default: fileName,
    });


    // Create the registration code
    const registrationCode = `
    wp_register_style('${registrationName}', get_theme_file_uri('/${cssPath}/${file}') );
`;

    // Insert the registration code before the closing brace
    indexPhpContent = indexPhpContent.slice(0, closingBraceIndex) + registrationCode + indexPhpContent.slice(closingBraceIndex);

    // Update the closing brace index for the next iteration
    closingBraceIndex += registrationCode.length;

    // Write the modified content back to the file
    fs.writeFileSync('index.php', indexPhpContent);

    console.log(`Style '${fileName}' registered as '${registrationName}' successfully.`);
  }
}

main();