// ErrorMessage.jsx - Error message display component

const ErrorMessage = ({ message }) => {
  // Handle both string and array messages
  const displayMessage = Array.isArray(message) ? message.join('\n') : message;
  
  // Split message by newlines to display multiple errors
  const messageLines = typeof displayMessage === 'string' 
    ? displayMessage.split('\n').filter(line => line.trim()) 
    : [displayMessage];

  return (
    <div className="error-message" style={{
      padding: '15px',
      marginBottom: '20px',
      backgroundColor: '#fee',
      border: '1px solid #fcc',
      borderRadius: '4px',
      color: '#c33',
    }}>
      <strong>❌ Error:</strong>
      {messageLines.length === 1 ? (
        <p style={{ margin: '8px 0 0 0' }}>{messageLines[0]}</p>
      ) : (
        <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
          {messageLines.map((line, index) => (
            <li key={index} style={{ margin: '4px 0' }}>{line.replace(/^•\s*/, '')}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ErrorMessage;

