/**
 * Utility functions for cleaning and formatting student report text,
 * ensuring no awkward raw hashtags (#Engineer, #Entrepreneur) leak into final outputs.
 */

/**
 * Converts camelCase or PascalCase into spaced words.
 * e.g., "SoftwareEngineer" -> "Software Engineer"
 */
export function splitCamelCase(text: string): string {
  return text.replace(/([a-z])([A-Z])/g, '$1 $2');
}

/**
 * Thoroughly sanitizes user prompts and topic tags:
 * - Converts "#SoftwareEngineer" to "Software Engineer"
 * - Converts "#Entrepreneur" to "Entrepreneur"
 * - Removes any remaining stray '#' symbols
 * - Normalizes excessive whitespace
 */
export function cleanStudentNotesAndTags(rawText?: string): string {
  if (!rawText) return '';
  
  return rawText
    // Convert hashtag PascalCase or camelCase like #SoftwareEngineer -> Software Engineer
    .replace(/#([a-zA-Z0-9_]+)/g, (_, match) => {
      return splitCamelCase(match).replace(/_/g, ' ');
    })
    // Remove any remaining stray hashes
    .replace(/#/g, '')
    // Normalize extra spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Converts a list of selected topics into a natural, conversational student English phrase.
 * e.g., ['Software Engineer', 'Coding'] -> "wanting to become a Software Engineer and my coding projects"
 */
export function formatTopicsToStudentPhrase(topics: string[]): string {
  const cleaned = topics.map(t => cleanStudentNotesAndTags(t)).filter(Boolean);
  if (cleaned.length === 0) {
    return "wanting to become a Software Engineer, my hobbies, and my strengths and weaknesses";
  }
  if (cleaned.length === 1) {
    return cleaned[0];
  }
  if (cleaned.length === 2) {
    return `${cleaned[0]} and ${cleaned[1]}`;
  }
  const last = cleaned[cleaned.length - 1];
  const rest = cleaned.slice(0, -1);
  return `${rest.join(', ')}, and ${last}`;
}
