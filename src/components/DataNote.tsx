export default function DataNote() {
  return (
    <p className="mt-6 text-xs text-gray-500 max-w-xl">
      Source: SFMTA citation export via DataSF. Updates daily with about a 24 hour lag. Locations may be imperfect if address data is incomplete.
      {' '}<a href="/status" className="underline underline-offset-2">Status</a>
    </p>
  )
}
