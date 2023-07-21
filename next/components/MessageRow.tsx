import Highlighter from 'react-highlight-words'
import BeatLoader from 'react-spinners/BeatLoader'

const MessageRow = ({ message }: any) => {
  const highlight = (txt: string) => (
    <>
      <span style={{ color: 'red', background: 'transparent' }}>{txt}</span>
    </>
  )
  return (
    <div
      // w-full p-4 flex border-b border-gray-300
      className={`w-full p-4 flex rounded-lg border-gray-300 mb-4 ${
        message.user === 'System' ? 'bg-slate-100 dark:bg-neutral-900 dark:shadow-indigo-900 shadow-md' : ''
      }`}
    >
      <div className='w-16 mr-8 text-md'>{message.user}:</div>
      <div className=''>
        {message.message ? (
          <Highlighter
            highlightStyle={{
              color: 'red',
              backgroundColor: 'transparent',
            }}
            searchWords={['hxxp', 'hxxps', 'fxp']}
            autoEscape={true}
            textToHighlight={message.message}
          />
        ) : (
          <BeatLoader color='#666' size={4} speedMultiplier={0.5} />
        )}
      </div>
    </div>
  )
}


export default MessageRow