// src/components/demo/SplineDemo.tsx
"use client";
import React, { useState, useEffect } from "react";
import { SplineScene } from "./splite";

export function SplineSceneBasic() {
  const [currentRole, setCurrentRole] = useState(0);
  const [count, setCount] = useState({ projects: 0, customers: 0 });
  
  const roles = [
    "Full Stack Developer",
    "Backend Developer", 
    "Frontend Developer",
    "API Specialist"
  ];

  useEffect(() => {
    const targetProjects = 25;
    const targetCustomers = 18;
    const duration = 2000;
    const steps = 60;
    const incrementProjects = targetProjects / steps;
    const incrementCustomers = targetCustomers / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      if (currentStep < steps) {
        setCount({
          projects: Math.min(Math.floor(incrementProjects * currentStep), targetProjects),
          customers: Math.min(Math.floor(incrementCustomers * currentStep), targetCustomers)
        });
        currentStep++;
      } else {
        setCount({ projects: targetProjects, customers: targetCustomers });
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-transparent">
      <div className="flex flex-col md:flex-row h-full items-center justify-center">
        <div className="flex-1 relative z-10 px-8 md:px-12 lg:px-16">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center md:text-left">
            I'm a{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent animate-pulse">
              {roles[currentRole]}
            </span>
          </h1>
          
          <p className="mt-6 text-neutral-300 max-w-2xl text-base md:text-lg leading-relaxed text-center md:text-left">
            I'm a passionate developer who enjoys building clean and interactive web experiences. 
            I've worked on multiple frontend and full-stack projects where I focus on creating smooth UI, 
            responsive designs, and user-friendly interfaces.
          </p>
          
          <div className="mt-8 flex gap-8 justify-center md:justify-start">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400">{count.projects}+</div>
              <div className="text-sm text-gray-400 mt-1">Projects Completed</div>
            </div>
            <div className="w-px h-12 bg-gray-700"></div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-400">{count.customers}+</div>
              <div className="text-sm text-gray-400 mt-1">Happy Customers</div>
            </div>
          </div>
          
          <div className="mt-8 flex gap-5 justify-center md:justify-start">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-all duration-300 hover:scale-110">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.58 0-.287-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.082-.73.082-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.698.83.578C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-all duration-300 hover:scale-110">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-all duration-300 hover:scale-110">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-all duration-300 hover:scale-110">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.032 0c-6.627 0-12 5.373-12 12 0 2.115.55 4.104 1.513 5.844L.24 23.76l6.171-1.608c1.69.92 3.614 1.449 5.62 1.449 6.627 0 12-5.373 12-12s-5.373-12-12-12zm0 21.6c-1.803 0-3.506-.492-4.995-1.405l-.358-.214-3.663.954.976-3.572-.23-.377c-1.008-1.607-1.545-3.476-1.545-5.386 0-5.523 4.477-10 10-10 5.522 0 10 4.477 10 10s-4.478 10-10 10zm5.196-7.76c-.284-.142-1.68-.829-1.94-.924-.26-.095-.448-.142-.637.142-.189.284-.733.924-.898 1.114-.165.19-.33.213-.614.07-.284-.142-1.199-.442-2.284-1.41-.844-.753-1.414-1.682-1.58-1.966-.165-.284-.018-.438.124-.579.13-.13.284-.33.426-.497.142-.165.189-.284.284-.474.095-.189.048-.355-.024-.498-.071-.142-.637-1.537-.874-2.104-.23-.552-.464-.477-.637-.486-.166-.01-.355-.01-.544-.01-.189 0-.497.071-.757.355-.26.284-.994.971-.994 2.369 0 1.398 1.017 2.747 1.158 2.937.142.19 2 3.055 4.845 4.285.676.293 1.204.468 1.616.599.679.217 1.297.186 1.785.113.545-.08 1.68-.687 1.917-1.35.237-.663.237-1.231.166-1.35-.071-.118-.26-.19-.544-.33z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="flex-1 relative h-full min-h-[500px]">
          <div className="w-full h-full">
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}