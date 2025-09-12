'use client';

import Link from 'next/link';

import { useCallback, useEffect, useRef, useState } from 'react';

import Logo from './Logo';

import { Icon } from '@iconify/react/dist/iconify.js';

import SignUp from '../Auth/SignUp';

import Signin from '../Auth/SignIn';

import { useAuth } from '@/hooks/userAuth';

const Header = () => {
  const [sticky, setSticky] = useState(false);

  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { user, logout } = useAuth();

  const signInRef = useRef<HTMLDivElement>(null);

  const signUpRef = useRef<HTMLDivElement>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    setSticky(window.scrollY >= 20);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
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
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);

      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    if (isSignInOpen || isSignUpOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isSignInOpen, isSignUpOpen]);

  const getInitials = (name: string) => {
    return name

      .split(' ')

      .map((word) => word.charAt(0))

      .join('')

      .toUpperCase()

      .slice(0, 2);
  };

  return (
    <header
      className={`fixed top-0 z-40 py-4 w-full transition-all duration-300 ${
        sticky ? 'shadow-lg bg-background' : 'shadow-none'
      }`}
    >
      <div>
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Logo */}
          <div>
            <Logo />
          </div>

          {/* Auth Section */}
          <div className="flex flex-wrap items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* Avatar */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium hover:bg-primary/90 transition duration-300 ease-in-out"
                >
                  {getInitials(user.name!)}
                </button>

                {/* Dropdown Menu */}

                {isDropdownOpen && (
                  <div className="absolute right-0 top-12 w-52 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-2 border-b border-border">
                      <div className="font-medium text-foreground">
                        {user.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        href="/pages/profile"
                        className="block px-4 py-2 text-foreground hover:bg-muted transition duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Icon
                          icon="solar:user-bold"
                          className="inline-block mr-2"
                        />
                        Profile
                      </Link>
                      <Link
                        href="/pages/stalls"
                        className="block px-4 py-2 text-foreground hover:bg-muted transition duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Icon
                          icon="solar:shop-bold"
                          className="inline-block mr-2"
                        />
                        Add Your Own Stall
                      </Link>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);

                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-destructive hover:bg-muted transition duration-200"
                      >
                        <Icon
                          icon="solar:logout-bold"
                          className="inline-block mr-2"
                        />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg border border-primary hover:bg-muted hover:text-foreground transition duration-300 ease-in-out"
                  onClick={() => setIsSignInOpen(true)}
                >
                  Sign In
                </button>
                <button
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg border border-primary hover:bg-muted hover:text-foreground transition duration-300 ease-in-out"
                  onClick={() => setIsSignUpOpen(true)}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sign In Modal */}

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
                  className="hover:text-primary"
                />
              </button>
              <Signin onSuccess={() => setIsSignInOpen(false)} />
            </div>
          </div>
        )}

        {/* Sign Up Modal */}

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
                  className="hover:text-primary"
                />
              </button>
              <SignUp onSuccess={() => setIsSignUpOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
