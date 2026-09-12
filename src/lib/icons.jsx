// Tiny 8x8 pixel-art icons for the treat catalog. Each icon is a character
// grid (one row per string, one column per char) mapped through a palette,
// so new icons are just a grid + a couple of colors.
function pixelIcon(rows, palette) {
  return function render({ size = 20 } = {}) {
    return (
      <svg viewBox="0 0 8 8" width={size} height={size} shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
        {rows.flatMap((row, y) =>
          row.split('').map((ch, x) => {
            const fill = palette[ch]
            if (!fill) return null
            return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />
          })
        )}
      </svg>
    )
  }
}

export const TREAT_ICONS = [
  {
    id: 'boba',
    label: 'Boba tea',
    render: pixelIcon(
      ['...s....', '...s....', '..llll..', '.tttttt.', '.tbttbt.', '.tttttt.', '.tbttbt.', '..llll..'],
      { t: '#b06a3a', l: '#e8dcc8', s: '#6b8f3f', b: '#3a261a' }
    ),
  },
  {
    id: 'clothes',
    label: 'Clothes',
    render: pixelIcon(
      ['.dd..dd.', 'ddffffdd', '.ffffff.', '.ffffff.', '.ffffff.', '.ffffff.', '.ffffff.', '.ffffff.'],
      { f: '#5b7fb5', d: '#33507d' }
    ),
  },
  {
    id: 'book',
    label: 'Book',
    render: pixelIcon(
      ['.cccccc.', '.cppppc.', '.cppppc.', '.cppppc.', '.cppppc.', '.cppppc.', '.cppppc.', '.cccccc.'],
      { c: '#7a2c1a', p: '#f0e6d2' }
    ),
  },
  {
    id: 'movie',
    label: 'Movie',
    render: pixelIcon(
      ['wbwbwbwb', 'bbbbbbbb', 'bbbbbbbb', 'bbbbbbbb', 'bbbbbbbb', 'bbbbbbbb', 'bbbbbbbb', 'bbbbbbbb'],
      { b: '#2b2b2b', w: '#e8e6df' }
    ),
  },
  {
    id: 'game',
    label: 'Game',
    render: pixelIcon(
      ['..gggg..', '.gdggdg.', 'gggggggg', 'g..gg..g', 'gggggggg', '.gg..gg.', '........', '........'],
      { g: '#4a4a4a', d: '#e0c341' }
    ),
  },
  {
    id: 'coffee',
    label: 'Coffee',
    render: pixelIcon(
      ['..s.s...', '.s.s....', '........', '.mmmmm..', '.mmmmmh.', '.mmmmmh.', '.mmmmm..', '..mmm...'],
      { m: '#6b4a34', h: '#6b4a34', s: '#b7a68f' }
    ),
  },
  {
    id: 'plant',
    label: 'Plant',
    render: pixelIcon(
      ['.l.l.l..', 'l.l.l.l.', '..lll...', '...l....', '...l....', '.ppppp..', '.ppppp..', '..ppp...'],
      { l: '#4f7a3a', p: '#a3592f' }
    ),
  },
  {
    id: 'gift',
    label: 'Gift',
    render: pixelIcon(
      ['..r..r..', '..rrrr..', '.bbrrbb.', '.bbrrbb.', '.bbrrbb.', '.rrrrrr.', '.bbrrbb.', '.bbrrbb.'],
      { b: '#b5482f', r: '#e8c341' }
    ),
  },
]

export function iconById(id) {
  return TREAT_ICONS.find((i) => i.id === id) ?? TREAT_ICONS[TREAT_ICONS.length - 1]
}
