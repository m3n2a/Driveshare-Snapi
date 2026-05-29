export class ApiError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error);
  if (error instanceof ApiError) {
    return Response.json({ error: error.message }, { status: error.statusCode });
  }
  return Response.json({ error: 'Internal Server Error' }, { status: 500 });
}
