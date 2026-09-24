import { useEffect, useState } from 'react'

import { supabase } from './lib/supabase'

import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'

import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const [supabaseStatus, setSupabaseStatus] = useState(
    'Testing Supabase connection...'
  )

  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [showSignup, setShowSignup] = useState(false)

  // --------------------------------------------
  // Test Supabase connection
  // --------------------------------------------

  useEffect(() => {
    async function testSupabase() {
      const { error } = await supabase.auth.getSession()

      if (error) {
        console.error('Supabase connection error:', error)
        setSupabaseStatus('Supabase connection failed.')
        return
      }

      setSupabaseStatus('Supabase connected!')
    }

    testSupabase()
  }, [])

  // --------------------------------------------
  // Check existing login session
  // --------------------------------------------

  useEffect(() => {
    async function getUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setUser(session?.user ?? null)
      setAuthLoading(false)
    }

    getUser()

    // Listen for login/logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // --------------------------------------------
  // Logout
  // --------------------------------------------

  async function handleLogout() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
      return
    }

    setUser(null)
  }

  // --------------------------------------------
  // Loading screen
  // --------------------------------------------

  if (authLoading) {
    return (
      <div>
        <h1>GlowMatch</h1>
        <p>Loading...</p>
      </div>
    )
  }

  // --------------------------------------------
  // Login / Signup screen
  // --------------------------------------------

  if (!user) {
    return (
      <div>
        {showSignup ? (
          <Signup
            onSwitchToLogin={() => setShowSignup(false)}
            onSignupSuccess={(newUser) => {
              setUser(newUser)
            }}
          />
        ) : (
          <Login
            onSwitchToSignup={() => setShowSignup(true)}
            onLoginSuccess={(loggedInUser) => {
              setUser(loggedInUser)
            }}
          />
        )}
      </div>
    )
  }

  // --------------------------------------------
  // Logged-in app
  // --------------------------------------------

  return (
    <>
      <div
        style={{
          padding: '16px',
          textAlign: 'right',
          borderBottom: '1px solid #ddd',
        }}
      >
        <span>
          Logged in as: <strong>{user.email}</strong>
        </span>

        <button
          type="button"
          onClick={handleLogout}
          style={{ marginLeft: '12px' }}
        >
          Log Out
        </button>
      </div>

      <section id="center">
        <div className="hero">
          <img
            src={heroImg}
            className="base"
            width="170"
            height="179"
            alt=""
          />

          <img
            src={reactLogo}
            className="framework"
            alt="React logo"
          />

          <img
            src={viteLogo}
            className="vite"
            alt="Vite logo"
          />
        </div>

        <div>
          <h1>Get started</h1>

          <p>
            <strong>{supabaseStatus}</strong>
          </p>

          <p>
            Logged in successfully as:
            <br />
            <strong>{user.email}</strong>
          </p>

          <p>
            Edit <code>src/App.jsx</code> and save to test{' '}
            <code>HMR</code>
          </p>
        </div>

        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg
            className="icon"
            role="presentation"
            aria-hidden="true"
          >
            <use href="/icons.svg#documentation-icon"></use>
          </svg>

          <h2>Documentation</h2>

          <p>Your questions, answered</p>

          <ul>
            <li>
              <a
                href="https://vite.dev/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="logo"
                  src={viteLogo}
                  alt=""
                />
                Explore Vite
              </a>
            </li>

            <li>
              <a
                href="https://react.dev/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="button-icon"
                  src={reactLogo}
                  alt=""
                />
                Learn more
              </a>
            </li>
          </ul>
        </div>

        <div id="social">
          <svg
            className="icon"
            role="presentation"
            aria-hidden="true"
          >
            <use href="/icons.svg#social-icon"></use>
          </svg>

          <h2>Connect with us</h2>

          <p>Join the Vite community</p>

          <ul>
            <li>
              <a
                href="https://github.com/vitejs/vite"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>

                GitHub
              </a>
            </li>

            <li>
              <a
                href="https://chat.vite.dev/"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>

                Discord
              </a>
            </li>

            <li>
              <a
                href="https://x.com/vite_js"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>

                X.com
              </a>
            </li>

            <li>
              <a
                href="https://bsky.app/profile/vite.dev"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>

                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>

      <section id="spacer"></section>
    </>
  )
}

export default App
