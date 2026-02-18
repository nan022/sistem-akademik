"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, PlusCircle } from "lucide-react";
import { useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { EnrollmentForm } from "./enroll-form";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-1">
            <Link href="/" className="hidden text-gray-900 dark:text-white md:flex flex-row items-center">
              <img src="/images/logos/logos.svg" alt="Logo" className="w-25 h-auto" />
              <div className="flex flex-col">
                <span className="text-xl text-indigo-600 font-bold">Sistem Akademik</span>
                <span className="text-xs text-gray-500 font-normal">Created by Ronanda Saputra</span>
              </div>
            </Link>
            <Link href="/" className="md:hidden text-2xl text-gray-900 dark:text-white flex flex-col">
              <span className="text-indigo-600 font-bold">SIAK PCR</span>
              <span className="text-sm text-gray-400 font-normal">Akses Mudah, Data Aman!</span>
            </Link>
          </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 ml-8">
                <ModeToggle />
                <EnrollmentForm />
            </div>

            {/* Mobile Menu - ModeToggle & Hamburger */}
            <div className="md:hidden flex items-center space-x-3">
                <ModeToggle />
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Toggle menu"
                    >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4">
          {/* Categories Section */}
            <div className="px-4">
                {/* Action Buttons */}
                <div className="space-y-2">
                    <Link href={"/login"}>
                        <Button variant="outline" className="w-full border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Create New Enrollment
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
      )}
    </header>
  );
}