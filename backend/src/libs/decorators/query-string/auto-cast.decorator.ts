import { Transform } from 'class-transformer';
import { autoCastObject, autoCastValue } from '../../utils';

export const AutoCast = () =>
  Transform(({ value }) =>
    typeof value === 'object' ? autoCastObject(value) : autoCastValue(value),
  );
