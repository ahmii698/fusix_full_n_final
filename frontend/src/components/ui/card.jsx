export const Card = ({ children, className }) => {
  return (
    <div className={`rounded-lg bg-black/60 text-white shadow-sm backdrop-blur-sm ${className || ''}`}>
      {children}
    </div>
  )
}