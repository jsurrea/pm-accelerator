import { z } from 'zod'

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

const dateString = z
  .string()
  .regex(DATE_REGEX, 'Date must be in YYYY-MM-DD format')

const BaseSearchSchema = z.object({
  location: z
    .string()
    .min(1, 'Location is required')
    .max(200, 'Location is too long'),
  lat: z
    .number()
    .min(-90, 'Latitude must be >= -90')
    .max(90, 'Latitude must be <= 90'),
  lon: z
    .number()
    .min(-180, 'Longitude must be >= -180')
    .max(180, 'Longitude must be <= 180'),
  date_from: dateString,
  date_to: dateString,
})

export const CreateSearchSchema = BaseSearchSchema
  .refine(
    (data) => data.date_from <= data.date_to,
    { message: 'date_from must be on or before date_to', path: ['date_from'] }
  )
  .refine(
    (data) => {
      const today = new Date().toISOString().split('T')[0]
      return data.date_to <= today
    },
    { message: 'date_to cannot be in the future', path: ['date_to'] }
  )

export const UpdateSearchSchema = BaseSearchSchema.partial()
  .refine(
    (data) => {
      if (data.date_from && data.date_to) {
        return data.date_from <= data.date_to
      }
      return true
    },
    { message: 'date_from must be on or before date_to', path: ['date_from'] }
  )

export type CreateSearchInput = z.infer<typeof CreateSearchSchema>
export type UpdateSearchInput = z.infer<typeof UpdateSearchSchema>
