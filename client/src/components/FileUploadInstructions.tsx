export function FileUploadInstructions() {
  return (
    <div className="space-y-2">
      <p className="font-semibold">Instructions for File Upload Assignments:</p>
      <ul className="list-disc list-inside space-y-1">
        <li>
          Please specify the allowed file types in the assignment description.
        </li>
        <li>
          Include any specific formatting requirements for the submitted files.
        </li>
        <li>Mention the maximum file size limit, if any.</li>
        <li>Provide clear instructions on how the file should be named.</li>
      </ul>
    </div>
  );
}
