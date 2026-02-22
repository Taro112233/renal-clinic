// components/SettingsPage/SelectOptionsManager.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus, Pencil, Trash2, Loader2, ChevronDown, ChevronRight,
  Tag, ToggleLeft, ToggleRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSelectOptions, type SelectOption } from '@/hooks/useSelectOptions';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// ─── Category display names ───────────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  prefix: 'คำนำหน้าชื่อ',
  dmard: 'ยา DMARD',
  eye_screening_status: 'สถานะตรวจตา',
  eye_result: 'ผลการตรวจตา',
  alcohol: 'การดื่มแอลกอฮอล์',
  herb: 'สมุนไพร / อาหารเสริม',
  smoking: 'การสูบบุหรี่',
  drp_type: 'ประเภท DRP',
  me_type: 'ประเภท ME',
  contraception: 'วิธีคุมกำเนิด',
};

const CATEGORY_ICONS: Record<string, string> = {
  prefix: '🏷️', dmard: '💊', eye_screening_status: '👁️', eye_result: '🔬',
  alcohol: '🍺', herb: '🌿', smoking: '🚬', drp_type: '⚠️', me_type: '📋',
  contraception: '🛡️',
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function ManagerSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map(i => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(j => (
                <Skeleton key={j} className="h-12 rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Option Chip ──────────────────────────────────────────────────────────────
interface OptionChipProps {
  option: SelectOption;
  onEdit: (opt: SelectOption) => void;
  onDelete: (opt: SelectOption) => void;
  onToggle: (opt: SelectOption) => void;
  isMutating: boolean;
}

function OptionChip({ option, onEdit, onDelete, onToggle, isMutating }: OptionChipProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        'group relative flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border transition-all',
        option.isActive
          ? 'bg-surface-secondary border-border-primary hover:border-border-interactive'
          : 'bg-surface-primary border-border-subtle opacity-50'
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-content-primary truncate">{option.label}</p>
        <p className="text-xs text-content-tertiary font-mono truncate">{option.value}</p>
      </div>

      {/* Actions — shown on hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={() => onToggle(option)}
          disabled={isMutating}
          title={option.isActive ? 'ซ่อน' : 'แสดง'}
        >
          {option.isActive
            ? <ToggleRight className="w-3.5 h-3.5 text-alert-success-icon" />
            : <ToggleLeft className="w-3.5 h-3.5 text-content-tertiary" />}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={() => onEdit(option)}
          disabled={isMutating}
        >
          <Pencil className="w-3.5 h-3.5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 hover:text-alert-error-text hover:bg-alert-error-bg"
          onClick={() => onDelete(option)}
          disabled={isMutating}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Sort order badge */}
      <span className="text-xs text-content-disabled font-mono opacity-0 group-hover:opacity-100 transition-opacity">
        #{option.sortOrder}
      </span>
    </motion.div>
  );
}

// ─── Category Card ────────────────────────────────────────────────────────────
interface CategoryCardProps {
  category: string;
  options: SelectOption[];
  onAddNew: (category: string) => void;
  onEdit: (opt: SelectOption) => void;
  onDelete: (opt: SelectOption) => void;
  onToggle: (opt: SelectOption) => void;
  isMutating: boolean;
}

function CategoryCard({
  category, options, onAddNew, onEdit, onDelete, onToggle, isMutating,
}: CategoryCardProps) {
  const [collapsed, setCollapsed] = useState(false);
  const label = CATEGORY_LABELS[category] ?? category;
  const icon = CATEGORY_ICONS[category] ?? '📋';
  const activeCount = options.filter(o => o.isActive).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardHeader
          className="cursor-pointer select-none"
          onClick={() => setCollapsed(c => !c)}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-interactive flex items-center justify-center text-lg shrink-0">
                {icon}
              </div>
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  {label}
                  <Badge variant="outline" className="text-xs font-mono">
                    {category}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  {activeCount} / {options.length} ตัวเลือก
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1.5 text-xs"
                onClick={(e) => { e.stopPropagation(); onAddNew(category); }}
                disabled={isMutating}
              >
                <Plus className="w-3.5 h-3.5" />
                เพิ่มตัวเลือก
              </Button>
              {collapsed
                ? <ChevronRight className="w-4 h-4 text-content-tertiary" />
                : <ChevronDown className="w-4 h-4 text-content-tertiary" />}
            </div>
          </div>
        </CardHeader>

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <CardContent className="pt-0">
                {options.length === 0 ? (
                  <p className="text-sm text-content-tertiary italic py-4 text-center">
                    ยังไม่มีตัวเลือก
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    <AnimatePresence>
                      {options.map(opt => (
                        <OptionChip
                          key={opt.id}
                          option={opt}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onToggle={onToggle}
                          isMutating={isMutating}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function SelectOptionsManager() {
  const { data, categories, loading, isMutating, createOption, updateOption, deleteOption } =
    useSelectOptions();

  // Add dialog state
  const [addDialog, setAddDialog] = useState<{ open: boolean; category: string }>({
    open: false, category: '',
  });
  const [addForm, setAddForm] = useState({ value: '', label: '', sortOrder: '' });
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});

  // Edit dialog state
  const [editDialog, setEditDialog] = useState<{ open: boolean; option: SelectOption | null }>({
    open: false, option: null,
  });
  const [editForm, setEditForm] = useState({ label: '', sortOrder: '' });

  // Delete confirm state
  const [deleteConfirm, setDeleteConfirm] = useState<SelectOption | null>(null);

  // ── Add handlers ─────────────────────────────────────────
  const openAdd = (category: string) => {
    const existing = data[category] ?? [];
    const maxOrder = existing.reduce((m, o) => Math.max(m, o.sortOrder), 0);
    setAddForm({ value: '', label: '', sortOrder: String(maxOrder + 1) });
    setAddErrors({});
    setAddDialog({ open: true, category });
  };

  const handleAdd = async () => {
    const errors: Record<string, string> = {};
    if (!addForm.value.trim()) errors.value = 'กรุณากรอก value';
    if (!addForm.label.trim()) errors.label = 'กรุณากรอก label';
    if (Object.keys(errors).length) { setAddErrors(errors); return; }

    const ok = await createOption({
      category: addDialog.category,
      value: addForm.value.trim(),
      label: addForm.label.trim(),
      sortOrder: parseInt(addForm.sortOrder) || 0,
    });

    if (ok) {
      toast.success('เพิ่มตัวเลือกสำเร็จ');
      setAddDialog({ open: false, category: '' });
    }
  };

  // ── Edit handlers ─────────────────────────────────────────
  const openEdit = (opt: SelectOption) => {
    setEditForm({ label: opt.label, sortOrder: String(opt.sortOrder) });
    setEditDialog({ open: true, option: opt });
  };

  const handleEdit = async () => {
    if (!editDialog.option) return;
    const ok = await updateOption(editDialog.option.id, {
      label: editForm.label.trim(),
      sortOrder: parseInt(editForm.sortOrder) || 0,
    });
    if (ok) {
      toast.success('แก้ไขตัวเลือกสำเร็จ');
      setEditDialog({ open: false, option: null });
    }
  };

  // ── Toggle ────────────────────────────────────────────────
  const handleToggle = async (opt: SelectOption) => {
    const ok = await updateOption(opt.id, { isActive: !opt.isActive });
    if (ok) toast.success(opt.isActive ? 'ซ่อนตัวเลือกแล้ว' : 'แสดงตัวเลือกแล้ว');
  };

  // ── Delete ────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    const ok = await deleteOption(deleteConfirm.id);
    if (ok) toast.success('ลบตัวเลือกสำเร็จ');
    setDeleteConfirm(null);
  };

  if (loading) return <ManagerSkeleton />;

  return (
    <>
      <div className="space-y-4">
        {categories.map(cat => (
          <CategoryCard
            key={cat}
            category={cat}
            options={data[cat] ?? []}
            onAddNew={openAdd}
            onEdit={openEdit}
            onDelete={setDeleteConfirm}
            onToggle={handleToggle}
            isMutating={isMutating}
          />
        ))}
      </div>

      {/* ── Add Dialog ── */}
      <Dialog open={addDialog.open} onOpenChange={o => setAddDialog(p => ({ ...p, open: o }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              เพิ่มตัวเลือกใน "{CATEGORY_LABELS[addDialog.category] ?? addDialog.category}"
            </DialogTitle>
            <DialogDescription>
              category: <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{addDialog.category}</code>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="add-value">Value (รหัส) *</Label>
              <Input
                id="add-value"
                value={addForm.value}
                onChange={e => setAddForm(p => ({ ...p, value: e.target.value.toUpperCase() }))}
                placeholder="เช่น MTX, YES_BEER"
                className={addErrors.value ? 'border-alert-error-border' : ''}
              />
              {addErrors.value && <p className="text-xs text-alert-error-text">{addErrors.value}</p>}
              <p className="text-xs text-content-tertiary">ใช้ตัวพิมพ์ใหญ่และ _ เท่านั้น ห้ามมี space</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-label">Label (แสดงผล) *</Label>
              <Input
                id="add-label"
                value={addForm.label}
                onChange={e => setAddForm(p => ({ ...p, label: e.target.value }))}
                placeholder="เช่น เมโธเทรกเซต, Yes เบียร์"
                className={addErrors.label ? 'border-alert-error-border' : ''}
              />
              {addErrors.label && <p className="text-xs text-alert-error-text">{addErrors.label}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-order">ลำดับการแสดง</Label>
              <Input
                id="add-order"
                type="number"
                value={addForm.sortOrder}
                onChange={e => setAddForm(p => ({ ...p, sortOrder: e.target.value }))}
                placeholder="0"
                className="w-24"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialog({ open: false, category: '' })}>
              ยกเลิก
            </Button>
            <Button
              onClick={handleAdd}
              disabled={isMutating}
              className="gradient-brand-semantic hover:opacity-90"
            >
              {isMutating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              เพิ่มตัวเลือก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Dialog ── */}
      <Dialog open={editDialog.open} onOpenChange={o => setEditDialog(p => ({ ...p, open: o }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="w-4 h-4" />
              แก้ไขตัวเลือก
            </DialogTitle>
            <DialogDescription>
              value: <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{editDialog.option?.value}</code>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-label">Label (แสดงผล)</Label>
              <Input
                id="edit-label"
                value={editForm.label}
                onChange={e => setEditForm(p => ({ ...p, label: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-order">ลำดับการแสดง</Label>
              <Input
                id="edit-order"
                type="number"
                value={editForm.sortOrder}
                onChange={e => setEditForm(p => ({ ...p, sortOrder: e.target.value }))}
                className="w-24"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog({ open: false, option: null })}>
              ยกเลิก
            </Button>
            <Button
              onClick={handleEdit}
              disabled={isMutating}
              className="gradient-brand-semantic hover:opacity-90"
            >
              {isMutating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm ── */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={o => !o && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบตัวเลือก</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการลบ <strong>"{deleteConfirm?.label}"</strong>{' '}
              (<code className="font-mono text-xs">{deleteConfirm?.value}</code>) ออกจากระบบหรือไม่?
              การลบนี้ไม่สามารถกู้คืนได้ และอาจกระทบข้อมูลที่มีอยู่
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-alert-error-bg text-alert-error-text border border-alert-error-border hover:opacity-90"
            >
              {isMutating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              ลบตัวเลือก
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}