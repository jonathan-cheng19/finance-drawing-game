import './LoadingAnimation.css'

function LoadingAnimation({ message = "Loading..." }) {
  return (
    <div className="loading-animation">
      <div className="loading-gif-container">
        <img 
          src="https://cdn.dribbble.com/userupload/19717488/file/original-ab2b706145078367c875f2922b392c20.gif" 
          alt="Loading"
          className="loading-gif"
        />
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  )
}

export default LoadingAnimation
