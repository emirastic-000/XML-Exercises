/**
 * XML Exercise Validator
 * Validates user submissions for various XML exercise types.
 * Uses DOMParser-style parsing for well-formedness and structure checks.
 */

/**
 * Main validation entry point.
 * @param {object} exercise - Exercise definition from YAML
 * @param {string} code - User's submitted code
 * @returns {{ passed: boolean, errors: string[], hints: string[] }}
 */
export function validateExercise(exercise, code) {
  switch (exercise.type) {
    case 'write-xml':
      return validateWriteXml(exercise, code);
    case 'fix-xml':
      return validateFixXml(exercise, code);
    case 'write-xpath':
      return validateWriteXpath(exercise, code);
    case 'create-xsd':
      return validateCreateXsd(exercise, code);
    case 'write-xslt':
      return validateWriteXslt(exercise, code);
    default:
      return { passed: false, errors: [`Unknown exercise type: ${exercise.type}`], hints: [] };
  }
}

function validateWriteXml(exercise, code) {
  const errors = [];
  const hints = [];
  const validation = exercise.validation || {};

  // Check well-formedness by trying to parse
  const parseResult = tryParseXml(code);
  if (!parseResult.success) {
    return { passed: false, errors: [`XML is not well-formed: ${parseResult.error}`], hints: ['Make sure all tags are properly opened and closed.'] };
  }

  if (validation.wellFormed && !parseResult.success) {
    errors.push('XML is not well-formed.');
  }

  // Check required elements
  if (validation.requiredElements) {
    for (const tag of validation.requiredElements) {
      const regex = new RegExp(`<${tag}[\\s>/]`, 'i');
      if (!regex.test(code)) {
        errors.push(`Missing required element: <${tag}>`);
        hints.push(`Your XML should contain a <${tag}> element.`);
      }
    }
  }

  // Check required attributes
  if (validation.requiredAttributes) {
    for (const { element, attr } of validation.requiredAttributes) {
      const regex = new RegExp(`<${element}[^>]*\\s${attr}\\s*=`, 'i');
      if (!regex.test(code)) {
        errors.push(`Element <${element}> is missing attribute "${attr}"`);
        hints.push(`Add a ${attr} attribute to your <${element}> element.`);
      }
    }
  }

  // Check minimum element counts
  if (validation.minElements) {
    for (const [tag, min] of Object.entries(validation.minElements)) {
      const regex = new RegExp(`<${tag}[\\s>/]`, 'gi');
      const matches = code.match(regex) || [];
      if (matches.length < min) {
        errors.push(`Expected at least ${min} <${tag}> element(s), found ${matches.length}`);
      }
    }
  }

  return { passed: errors.length === 0, errors, hints };
}

function validateFixXml(exercise, code) {
  const errors = [];
  const hints = [];

  const parseResult = tryParseXml(code);
  if (!parseResult.success) {
    return { passed: false, errors: [`XML is still not well-formed: ${parseResult.error}`], hints: ['Look for unclosed tags or missing end tags.'] };
  }

  // Normalize and compare with expected output
  const normalizedUser = normalizeXml(code);
  const normalizedExpected = normalizeXml(exercise.expectedOutput);

  if (normalizedUser !== normalizedExpected) {
    errors.push('Your XML does not match the expected output.');
    hints.push('Check that all tags are properly closed and nested correctly.');
  }

  return { passed: errors.length === 0, errors, hints };
}

function validateWriteXpath(exercise, code) {
  // XPath validation requires server-side XML evaluation
  // For now, do a simple string comparison with expected answers
  const errors = [];
  const userAnswer = code.trim();

  if (exercise.expectedAnswer) {
    const expected = Array.isArray(exercise.expectedAnswer) ? exercise.expectedAnswer : [exercise.expectedAnswer];
    if (!expected.includes(userAnswer)) {
      errors.push('Your XPath expression does not produce the expected result.');
    }
  }

  return { passed: errors.length === 0, errors, hints: errors.length ? ['Review the XPath syntax and the source document.'] : [] };
}

function validateCreateXsd(exercise, code) {
  const errors = [];

  const parseResult = tryParseXml(code);
  if (!parseResult.success) {
    return { passed: false, errors: ['Your XSD is not well-formed XML.'], hints: ['An XSD must be valid XML.'] };
  }

  // Check for basic XSD structure
  if (!code.includes('xs:schema') && !code.includes('xsd:schema')) {
    errors.push('Missing root <xs:schema> element.');
  }

  // Check for required type definitions
  if (exercise.requiredTypes) {
    for (const typeName of exercise.requiredTypes) {
      if (!code.includes(typeName)) {
        errors.push(`Missing type or element definition: "${typeName}"`);
      }
    }
  }

  return { passed: errors.length === 0, errors, hints: errors.length ? ['Make sure your schema defines all required elements and types.'] : [] };
}

function validateWriteXslt(exercise, code) {
  const errors = [];

  const parseResult = tryParseXml(code);
  if (!parseResult.success) {
    return { passed: false, errors: ['Your XSLT is not well-formed XML.'], hints: ['An XSLT must be valid XML.'] };
  }

  if (!code.includes('xsl:stylesheet') && !code.includes('xsl:transform')) {
    errors.push('Missing <xsl:stylesheet> root element.');
  }

  // Check for required templates
  if (exercise.requiredTemplates) {
    for (const match of exercise.requiredTemplates) {
      if (!code.includes(`match="${match}"`)) {
        errors.push(`Missing template with match="${match}"`);
      }
    }
  }

  return { passed: errors.length === 0, errors, hints: errors.length ? ['Your XSLT must have an xsl:stylesheet root and the required templates.'] : [] };
}

/**
 * Try to parse XML and check well-formedness.
 * Uses a regex-based heuristic check since we're in Node.js without a browser DOM.
 * For production, this would use libxmljs2.
 */
function tryParseXml(xml) {
  try {
    const trimmed = xml.trim();
    if (!trimmed) return { success: false, error: 'Empty input' };

    // Basic checks
    if (!trimmed.startsWith('<')) return { success: false, error: 'XML must start with a tag' };

    // Check for matching tags (simplified)
    const tagStack = [];
    const tagRegex = /<\/?([a-zA-Z][\w:.-]*)[^>]*?\/?>/g;
    let match;

    while ((match = tagRegex.exec(trimmed)) !== null) {
      const fullMatch = match[0];
      const tagName = match[1];

      if (fullMatch.startsWith('<?') || fullMatch.startsWith('<!')) continue;
      if (fullMatch.endsWith('/>')) continue; // self-closing

      if (fullMatch.startsWith('</')) {
        if (tagStack.length === 0 || tagStack[tagStack.length - 1] !== tagName) {
          return { success: false, error: `Unexpected closing tag </${tagName}>` };
        }
        tagStack.pop();
      } else {
        tagStack.push(tagName);
      }
    }

    if (tagStack.length > 0) {
      return { success: false, error: `Unclosed tag(s): ${tagStack.join(', ')}` };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function normalizeXml(xml) {
  return xml
    .replace(/\r\n/g, '\n')
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .trim();
}
