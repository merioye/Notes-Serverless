import { ValidationError, validate } from "class-validator";

export const validateBody = async (
  body: any
): Promise<ValidationError[] | false> => {
  const errors = await validate(body, {
    ValidationError: { target: true },
  });

  return errors.length ? errors : false;
};
