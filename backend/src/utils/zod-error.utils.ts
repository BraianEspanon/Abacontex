import { ZodIssue } from 'zod';

type ValidationErrorDetail = {
  location: string;
  field: string;
  message: string;
};

export function formatZodIssues(issues: ZodIssue[]): ValidationErrorDetail[] {
  return issues.map((issue) => {
    const [location = 'body', ...fieldPath] = issue.path;

    return {
      location: String(location),
      field: fieldPath.join('.'),
      message: formatMessage(issue),
    };
  });
}

function formatMessage(issue: ZodIssue): string {
  // Si el schema ya definió un mensaje personalizado,
  // lo respetamos siempre.
  if (issue.message && !issue.message.startsWith('Invalid input')) {
    return issue.message;
  }

  switch (issue.code) {
    case 'invalid_type': {
      switch (issue.expected) {
        case 'string':
          return 'Debe ser un texto.';

        case 'number':
          return 'Debe ser un número.';

        case 'boolean':
          return 'Debe ser verdadero o falso.';

        case 'array':
          return 'Debe ser una lista.';

        case 'object':
          return 'Debe ser un objeto.';

        default:
          return 'El tipo de dato es inválido.';
      }
    }

    case 'invalid_format':
      return 'El formato es inválido.';

    case 'too_small':
      return issue.message;

    case 'too_big':
      return issue.message;

    case 'invalid_value':
      return 'El valor no es válido.';

    default:
      return issue.message || 'Valor inválido.';
  }
}
