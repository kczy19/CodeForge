import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadProblems() {
    const problemFiles = fs.readdirSync(__dirname)
        .filter(file => file.startsWith('problem') && file.endsWith('.js') && file !== 'index.js');
    
    const allProblems = [];
    for (const file of problemFiles) {
        const module = await import(`./${file}`);
        allProblems.push(Object.values(module)[0]);
    }
    return allProblems;
}

export const problems = await loadProblems();