const fs = require('fs');
const path = require('path');
const dir = 'src/components/dashboards';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Dashboard.jsx') && f !== 'PresidentDashboard.jsx');

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix layout container
    content = content.replace(
        /className="flex flex-col md:flex-row gap-6 animate-fade-in-up pb-10 min-h-screen relative"/g,
        'className="flex flex-col md:flex-row gap-6 animate-fade-in-up pb-10 min-h-screen relative w-full max-w-[100vw] overflow-x-hidden"'
    );
    
    // Fix sidebar width and min-width
    content = content.replace(
        /className="w-full md:w-64 shrink-0"/g,
        'className="w-full md:w-64 shrink-0 min-w-0"'
    );
    
    // Fix nav scrolling behavior
    content = content.replace(
        /className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar"/g,
        'className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full snap-x snap-mandatory"'
    );
    
    // Fix main content container width
    content = content.replace(
        /className="flex-1 w-full min-w-0"/g,
        'className="flex-1 w-full min-w-0 max-w-full"'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
});
