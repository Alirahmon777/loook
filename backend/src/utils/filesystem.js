import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

export const readFile = (fileName) => {
  try {
    return JSON.parse(
      readFileSync(join(process.cwd(), 'backend', 'src', 'database', fileName))
    );
  } catch (err) {
    console.log(err.message);
  }
};

export const writeFile = (fileName, data) => {
  try {
    writeFileSync(
      join(process.cwd(), 'backend', 'src', 'database', fileName),
      JSON.stringify(data, null, 4)
    );
    return true;
  } catch (err) {
    console.log(err.message);
    return false;
  }
};
