export default (template = '') => {
  let cursor = 0

  const parse = () => {
    const output = { children: [] }
    while (template[cursor]) {
      if (template.charCodeAt(cursor) === '<'.charCodeAt(0)) {
        if (template.charCodeAt(cursor + 1) === '/'.charCodeAt(0)) {
          return output
        }
        if(template.substring(cursor + 1, cursor + 4) === '!--') {
          cursor = template.indexOf('-->', cursor) + 3
        } else {
          parseNode(output)
        }
      }
      cursor++
    }

    return output
  }

  const parseNode = (output) => {
    const endPosition = template.indexOf('>', cursor)
    const tag = parseTag(template.substring(cursor + 1, endPosition))
    const node = { ...{ type: tag.type }, ...tag.attributes }

    // self closing tag
    if (template.charCodeAt(endPosition - 1) === '/'.charCodeAt(0)) {
      output.children.push(node)
    } else {
      cursor = endPosition
      const nested = parse()
      if (nested.children.length) {
        node.children = [...nested.children]
      }
      output.children.push(node)
    }
  }

  const parseTag = (tag) => {
    const result = {
      type: tag && tag.match(/[^\s]+/).shift()
    }
    const attributes = tag.match(/[:*\w-]+="[^"]*"/g) || []
    if (attributes.length) {
      result['attributes'] = attributes.reduce((obj, attr) => {
        const match = /(.+)=["'](.+)["']/.exec(attr)
        if (match) {
          obj[match[1]] = match[2]
        }
        return obj
      }, {})
    }

    return result
  }

  return parse()
}
