import { writeFile } from 'node:fs/promises'; 
import { items } from './data.js';
import { byCategory, search, top, total, categories, withDiscount } from './catalog.js';

const [cmd, arg] = process.argv.slice(2);

if (!cmd) {
  console.log(items);
} else if (cmd === 'search') {
  console.log(search(items, arg));
} else if (cmd === 'top') {
  console.log(top(items, Number(arg)));
} else if (cmd === 'total') {
  console.log(`El precio total es: ${total(items)} €`);
} else if (cmd === 'categories') {
  console.log(categories(items));
} else if (cmd === 'discount') {
  console.log(withDiscount(items, Number(arg)));
} else if (cmd === 'report') {
  
  const reportData = {
    count: items.length,
    total: total(items),
    categories: categories(items),
    top3: top(items, 3)
  };

  const jsonText = JSON.stringify(reportData, null, 2);

  await writeFile('report.json', jsonText);
  console.log("¡Reporte generado correctamente en report.json!");

} else {
  console.log(byCategory(items, cmd));
}