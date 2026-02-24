// components/SettingsPage/index.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SelectOptionsManager } from './SelectOptionsManager';

export function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative min-h-screen"
    >
      <div className="fixed inset-0 bg-linear-to-br from-brand-primary/5 via-brand-secondary/5 to-brand-tertiary/5 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg gradient-brand-semantic">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-content-primary">ตั้งค่าระบบ</h1>
          </div>
          <p className="text-content-secondary ml-12">
            จัดการข้อมูลอ้างอิงและตัวเลือก Dropdown ของระบบ
          </p>
        </motion.div>

        <Tabs defaultValue="select-options">
          <TabsList className="mb-6">
            <TabsTrigger value="select-options" className="gap-2">
              <Database className="w-4 h-4" />
              ตัวเลือก Dropdown
            </TabsTrigger>
          </TabsList>

          <TabsContent value="select-options">
            <SelectOptionsManager />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}