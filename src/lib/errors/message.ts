/**
 * Base interface for objects that include a user-friendly message, typically used for errors or status updates.
 */
export interface HasUserMessage {
  userMessage: string;
}

export function hasUserMessage(obj: any): obj is HasUserMessage {
  return obj && typeof obj.userMessage === "string";
}

export function formatErrorForUser(error: unknown): string {
  if (hasUserMessage(error)) {
    return error.userMessage;
  }
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }
  return "An unknown error occurred.";
}
