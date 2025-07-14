import React from 'react'

function Footer() {
  return (
    <div>
        <footer className="bg-white text-center py-6 border-t mt-6">
        <p className="text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} SkillSwap. Built with ❤️ to help people grow by learning together.
        </p>
      </footer>
    </div>
  )
}

export default Footer
