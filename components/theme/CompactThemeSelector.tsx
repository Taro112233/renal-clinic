"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Sparkles, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function CompactThemeSelector() {
  const {
    currentTheme,
    themes,
    activeTheme,
    isDark,
    isInitialized,
    changeTheme,
    toggleMode,
  } = useTheme();

  if (!isInitialized) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* ปรับขนาด h-10 และ rounded-xl ให้เท่ากับปุ่ม Stethoscope/Avatar ใน Header */}
        <Button
          variant="ghost"
          className="relative h-10 w-10 p-0 group rounded-xl overflow-hidden border border-border/50 hover:border-border transition-all"
          title="Change Theme"
        >
          <motion.div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors[0]}, ${currentTheme.colors[1]})`,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Palette className="h-5 w-5 text-white drop-shadow-sm" />
            
            {/* Overlay สำหรับเอฟเฟกต์วิ้งๆ */}
            <Sparkles className="absolute top-1 right-1 h-3 w-3 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 bg-card border border-border shadow-xl rounded-2xl p-0 overflow-hidden"
      >
        {/* Header Section */}
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
                style={{ background: `linear-gradient(135deg, ${currentTheme.colors[0]}, ${currentTheme.colors[1]})` }}
              >
                <Palette size={14} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground leading-none mb-1">
                  {currentTheme.name}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  {isDark ? "Dark Mode" : "Light Mode"}
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMode}
              className="h-8 w-8 rounded-lg border-border hover:bg-accent transition-all"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="moon"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Moon className="h-3.5 w-3.5 text-blue-400" fill="currentColor" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Sun className="h-3.5 w-3.5 text-yellow-500" fill="currentColor" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* Theme List */}
        <div className="p-2 max-h-80 overflow-y-auto">
          <div className="grid grid-cols-1 gap-1">
            {themes.map((theme) => {
              const IconComponent = theme.preview;
              const isActive = activeTheme === theme.id;
              
              return (
                <button
                  key={theme.id}
                  onClick={() => changeTheme(theme.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-2 rounded-xl transition-all duration-200 group border",
                    isActive 
                      ? "bg-accent border-border shadow-sm" 
                      : "hover:bg-accent/50 border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shadow-md transition-transform group-hover:scale-105"
                      style={{
                        background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})`,
                      }}
                    >
                      <IconComponent size={18} className="text-white" />
                    </div>
                    <div className="text-left">
                      <div className={cn(
                        "text-sm font-semibold",
                        isActive ? "text-primary" : "text-foreground"
                      )}>
                        {theme.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground line-clamp-1">
                        {theme.description}
                      </div>
                    </div>
                  </div>
                  
                  {isActive && (
                    <div className="mr-2 w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}