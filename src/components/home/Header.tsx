'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Logo from './Logo';
import { Icon } from '@iconify/react/dist/iconify.js';
import SignUp from '../Auth/SignUp';
import Signin from '../Auth/SignIn';
import { useAuth } from '@/hooks/userAuth';

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const { user, logout } = useAuth();

  const signInRef = useRef<HTMLDivElement>(null);
  const signUpRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  //   TODO
  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         const res = await fetch('/api/data');
  //         if (!res.ok) throw new Error('Failed to fetch');
  //         const data = await res.json();
  //         setHeaderLink(data.HeaderData);
  //       } catch (error) {
  //         throw new Error('Error fetching data');
  //       }
  //     };
  //     fetchData();
  //   }, []);

  const handleScroll = () => {
    setSticky(window.scrollY >= 20);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      signInRef.current &&
      !signInRef.current.contains(event.target as Node)
    ) {
      setIsSignInOpen(false);
    }
    if (
      signUpRef.current &&
      !signUpRef.current.contains(event.target as Node)
    ) {
      setIsSignUpOpen(false);
    }
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node) &&
      navbarOpen
    ) {
      setNavbarOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navbarOpen, isSignInOpen, isSignUpOpen, handleClickOutside]);

  useEffect(() => {
    if (isSignInOpen || isSignUpOpen || navbarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isSignInOpen, isSignUpOpen, navbarOpen]);

  return (
    <header
      className={`fixed top-0 z-40 py-4 w-full transition-all duration-300 ${
        sticky ? 'shadow-lg bg-background' : 'shadow-none'
      }`}
    >
      <div>
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <Logo />
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            <Link
              href="#"
              className="text-lg font-medium hover:text-primary hidden xl:block"
            >
              <Icon
                icon="solar:phone-bold"
                className="text-primary text-3xl lg:text-2xl inline-block me-2"
              />
              +1(909) 235-9814
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-base text-foreground">
                  Welcome, {user.name}
                </span>
                <button
                  onClick={logout}
                  className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-muted hover:text-foreground transition duration-300 ease-in-out"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg border border-primary hover:bg-muted hover:text-foreground transition duration-300 ease-in-out"
                  onClick={() => {
                    setIsSignInOpen(true);
                  }}
                >
                  Sign In
                </button>

                <button
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg border border-primary hover:bg-muted hover:text-foreground transition duration-300 ease-in-out"
                  onClick={() => {
                    setIsSignUpOpen(true);
                  }}
                >
                  Sign Up
                </button>
              </div>
            )}

            {isSignInOpen && (
              <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
                <div
                  ref={signInRef}
                  className="relative mx-auto w-full max-w-md overflow-hidden rounded-lg bg-card text-card-foreground backdrop-blur-md px-8 pt-14 pb-8 text-center"
                >
                  <button
                    onClick={() => setIsSignInOpen(false)}
                    className="absolute top-0 right-0 mr-4 mt-8 hover:cursor-pointer"
                    aria-label="Close Sign In Modal"
                  >
                    <Icon
                      icon="material-symbols:close-rounded"
                      width={24}
                      height={24}
                      className="hover:text-primary text-24 inline-block me-2"
                    />
                  </button>
                  <Signin onSuccess={() => setIsSignInOpen(false)} />
                </div>
              </div>
            )}

            {isSignUpOpen && (
              <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
                <div
                  ref={signUpRef}
                  className="relative mx-auto w-full max-w-md overflow-hidden rounded-lg bg-card text-card-foreground backdrop-blur-md px-8 pt-14 pb-8 text-center"
                >
                  <button
                    onClick={() => setIsSignUpOpen(false)}
                    className="absolute top-0 right-0 mr-4 mt-8 hover:cursor-pointer"
                    aria-label="Close Sign Up Modal"
                  >
                    <Icon
                      icon="material-symbols:close-rounded"
                      width={24}
                      height={24}
                      className="hover:text-primary text-24 inline-block me-2"
                    />
                  </button>

                  <SignUp onSuccess={() => setIsSignUpOpen(false)} />
                </div>
              </div>
            )}

            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="block lg:hidden p-2 rounded-lg"
              aria-label="Toggle mobile menu"
            >
              <span className="block w-6 h-0.5 bg-foreground"></span>
              <span className="block w-6 h-0.5 bg-foreground mt-1.5"></span>
              <span className="block w-6 h-0.5 bg-foreground mt-1.5"></span>
            </button>
          </div>
        </div>
        {navbarOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-40" />
        )}

        <div
          ref={mobileMenuRef}
          className={`lg:hidden fixed top-0 right-0 h-full w-full bg-background text-foreground shadow-lg transform transition-transform duration-300 max-w-xs ${
            navbarOpen ? 'translate-x-0' : 'translate-x-full'
          } z-50`}
        >
          <div className="flex items-center justify-between gap-2 p-4">
            <button
              onClick={() => setNavbarOpen(false)}
              className="hover:cursor-pointer"
              aria-label="Close menu Modal"
            >
              <Icon
                icon="material-symbols:close-rounded"
                width={24}
                height={24}
                className="text-foreground hover:text-primary text-24 inline-block me-2"
              />
            </button>
          </div>
          <Link
            href="#"
            className="text-lg font-medium hover:text-primary block md:hidden mt-6 p-4"
          >
            <Icon
              icon="solar:phone-bold"
              className="text-primary text-3xl lg:text-2xl inline-block me-2"
            />
            +1(909) 235-9814
          </Link>
          <nav className="flex flex-col items-start p-4">
            {/* {headerLink.map((item, index) => (
              <MobileHeaderLink key={index} item={item} />
            ))} */}
            <div className="mt-4 flex flex-col space-y-4 w-full">
              {user ? (
                <>
                  <span className="px-4 text-base text-foreground">
                    Welcome, {user.name}
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setNavbarOpen(false);
                    }}
                    className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-muted hover:text-foreground transition duration-300 ease-in-out"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="bg-muted text-primary border border-primary px-4 py-2 rounded-lg hover:bg-card hover:text-card-foreground transition duration-300 ease-in-out"
                    onClick={() => {
                      setIsSignInOpen(true);
                      setNavbarOpen(false);
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    className="bg-muted text-primary border border-primary px-4 py-2 rounded-lg hover:bg-card hover:text-card-foreground transition duration-300 ease-in-out"
                    onClick={() => {
                      setIsSignUpOpen(true);
                      setNavbarOpen(false);
                    }}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
