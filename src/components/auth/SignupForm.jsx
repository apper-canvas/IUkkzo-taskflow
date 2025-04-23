import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../../store/userSlice'
import { apperService } from '../../services/apperService'

function SignupForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const authContainerRef = useRef(null)

  useEffect(() => {
    if (!authContainerRef.current) return

    try {
      const ApperUI = apperService.getApperUI()
      const apperClient = apperService.getApperClient()

      ApperUI.setup(apperClient, {
        target: '#signup-container',
        clientId: 'fb41eb2a8d4f42078844220ca57f64f7',
        view: 'signup',
        onSuccess: function(user) {
          // Store user in Redux
          dispatch(setUser(user))

          // Store user in localStorage for persistence
          localStorage.setItem('apperUser', JSON.stringify(user))

          // Navigate to dashboard
          navigate('/dashboard')
        },
        onError: function(error) {
          console.error('Registration error:', error)
        }
      })

      ApperUI.showSignup('#signup-container')
    } catch (error) {
      console.error('Error setting up ApperUI:', error)
    }

    // Cleanup function
    return () => {
      // No specific cleanup needed as ApperUI handles this internally
    }
  }, [dispatch, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">TaskFlow</h1>
        </div>
        
        <h2 className="text-center text-xl font-semibold text-gray-700 mb-4">Create a new account</h2>
        
        {/* This div will be the target for ApperUI signup */}
        <div 
          id="signup-container" 
          ref={authContainerRef}
          className="min-h-[400px]"
        ></div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-700 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupForm