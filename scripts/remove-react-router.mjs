import fs from 'node:fs'
import path from 'node:path'

const files = [
  'src/App.tsx',
  'src/main.tsx',
  'src/components/AppShell.tsx',
  'src/pages/CurriculumPage.tsx',
  'src/pages/DashboardPage.tsx',
  'src/pages/NotebookPage.tsx',
  'src/pages/WelcomePage.tsx',
  'src/pages/WeekWorkspacePage.tsx',
]

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8')
  if (!content.includes("'react-router-dom'") && !content.includes('"react-router-dom"')) {
    throw new Error(`Expected a react-router-dom import in ${file}`)
  }
  const directory = path.dirname(file)
  let relative = path.relative(directory, 'src/lib/router').replaceAll('\\', '/')
  if (!relative.startsWith('.')) relative = `./${relative}`
  content = content
    .replaceAll("'react-router-dom'", `'${relative}'`)
    .replaceAll('"react-router-dom"', `"${relative}"`)
  fs.writeFileSync(file, content)
}

console.log('Replaced React Router imports with the local hash router.')
