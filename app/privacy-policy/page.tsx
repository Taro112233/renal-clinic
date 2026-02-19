// app/privacy-policy/page.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  AlertTriangle,
  Info,
  Lock,
  Eye,
  Database,
  Share2,
  UserX,
  Cookie,
  Globe,
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-surface-primary">
      <div className="fixed inset-0 bg-linear-to-br from-brand-primary/10 via-brand-secondary/10 to-brand-tertiary/10 pointer-events-none" />

      <main className="relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {/* Header */}
            <motion.div variants={fadeIn} className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-interactive-primary/10 rounded-full mb-4">
                <Shield className="w-8 h-8 text-interactive-primary" />
              </div>
              <h1 className="text-4xl font-bold text-content-primary mb-4">
                นโยบายความเป็นส่วนตัว
              </h1>
              <p className="text-lg text-content-secondary">
                Privacy Policy
              </p>
              <p className="text-sm text-content-tertiary mt-2">
                มีผลบังคับใช้: 26 มกราคม 2568
              </p>
            </motion.div>

            {/* PDPA Compliance Notice */}
            <motion.div variants={fadeIn}>
              <Alert className="border-alert-info-border bg-alert-info-bg mb-8">
                <Shield className="h-5 w-5 text-alert-info-icon" />
                <AlertDescription className="text-alert-info-text">
                  <strong className="font-semibold text-lg">🛡️ การคุ้มครองข้อมูลส่วนบุคคล (PDPA Compliance)</strong>
                  <p className="mt-2">
                    NextHealTH Sandbox ให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคลของคุณ
                    ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
                  </p>
                </AlertDescription>
              </Alert>
            </motion.div>

            {/* Section 1: Introduction */}
            <motion.div variants={fadeIn}>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-interactive-primary" />
                    1. บทนำ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-content-secondary">
                    นโยบายความเป็นส่วนตัว (&quot;นโยบาย&quot;) นี้อธิบายว่า NextHealTH Sandbox (&quot;เรา&quot;, &quot;ผู้ให้บริการ&quot;)
                    เก็บรวบรวม ใช้ เปิดเผย และคุ้มครองข้อมูลส่วนบุคคลของคุณ (&quot;ผู้ใช้&quot;, &quot;คุณ&quot;) อย่างไร
                  </p>

                  <div>
                    <h3 className="font-semibold text-content-primary mb-2">1.1 ผู้ควบคุมข้อมูลส่วนบุคคล (Data Controller):</h3>
                    <div className="bg-surface-secondary rounded-lg p-4 space-y-1 text-sm">
                      <p><strong>ชื่อ:</strong> NextHealTH Sandbox</p>
                      <p><strong>ประเภท:</strong> บุคคลธรรมดา (Individual)</p>
                      <p><strong>ที่อยู่:</strong> Phitsanulok, Thailand 65000</p>
                      <p><strong>อีเมล:</strong> thanatouchth@gmail.com</p>
                      <p><strong>โทรศัพท์:</strong> 095-590-4245</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-content-primary mb-2">1.2 เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO):</h3>
                    <Alert className="bg-alert-info-bg border-alert-info-border">
                      <Info className="h-4 w-4 text-alert-info-icon" />
                      <AlertDescription className="text-alert-info-text">
                        <strong>หมายเหตุ:</strong> ในฐานะบุคคลธรรมดาและ SME เรา<strong>ไม่บังคับตาม PDPA ให้มี DPO</strong>
                        <br />
                        <strong>ผู้ติดต่อ:</strong> thanatouchth@gmail.com (095-590-4245)
                        <br />
                        สามารถติดต่อเพื่อใช้สิทธิ์ตาม PDPA ได้ที่ช่องทางนี้
                      </AlertDescription>
                    </Alert>
                  </div>

                  <div>
                    <h3 className="font-semibold text-content-primary mb-2">1.3 การยอมรับนโยบาย:</h3>
                    <p className="text-content-secondary">
                      การใช้บริการของเรา ถือว่าคุณได้อ่าน เข้าใจ และยอมรับนโยบายนี้แล้ว
                      หากคุณไม่ยอมรับ กรุณาหยุดการใช้บริการทันที
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Section 2: Data Collection */}
            <motion.div variants={fadeIn}>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-alert-info-icon" />
                    2. ข้อมูลที่เราเก็บรวบรวม
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-content-primary mb-2">2.1 ข้อมูลที่คุณให้โดยตรง:</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-content-primary mb-2">📝 ข้อมูลการลงทะเบียน:</p>
                        <ul className="list-disc list-inside space-y-1 text-content-secondary text-sm ml-4">
                          <li>ชื่อ-นามสกุล (Name)</li>
                          <li>อีเมล (Email Address)</li>
                          <li>เบอร์โทรศัพท์ (Phone Number) - ไม่บังคับ</li>
                          <li>รหัสผ่าน (Password Hash - เข้ารหัสแล้ว)</li>
                          <li>รูปโปรไฟล์ (Profile Picture) - ถ้ามี</li>
                        </ul>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-content-primary mb-2">🏥 ข้อมูลคำขอพัฒนาเครื่องมือ:</p>
                        <ul className="list-disc list-inside space-y-1 text-content-secondary text-sm ml-4">
                          <li>หน่วยงาน/โรงพยาบาล (Department/Organization)</li>
                          <li>Pain Point และปัญหาในการทำงาน</li>
                          <li>ขั้นตอนการทำงานปัจจุบัน (Current Workflow)</li>
                          <li>สิ่งที่ต้องการให้ Tech ช่วย (Expected Tech Help)</li>
                          <li>ไฟล์แนบ (Attachments) - รูปภาพ, PDF</li>
                        </ul>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-content-primary mb-2">💬 ข้อมูลการสื่อสาร:</p>
                        <ul className="list-disc list-inside space-y-1 text-content-secondary text-sm ml-4">
                          <li>ความคิดเห็น (Comments)</li>
                          <li>การสนทนากับทีมพัฒนา</li>
                          <li>Feedback และข้อเสนอแนะ</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-content-primary mb-2">2.2 ข้อมูลที่เก็บอัตโนมัติ:</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-content-primary mb-2">🌐 ข้อมูลการใช้งาน (Usage Data):</p>
                        <ul className="list-disc list-inside space-y-1 text-content-secondary text-sm ml-4">
                          <li>IP Address</li>
                          <li>Browser Type และ Version</li>
                          <li>Operating System</li>
                          <li>Device Type (Mobile, Desktop, Tablet)</li>
                          <li>หน้าที่เข้าชม (Pages Visited)</li>
                          <li>เวลาที่เข้าใช้งาน (Timestamp)</li>
                          <li>Referrer URL (แหล่งที่มา)</li>
                        </ul>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-content-primary mb-2">🍪 Cookies และเทคโนโลยีคล้ายคลึง:</p>
                        <ul className="list-disc list-inside space-y-1 text-content-secondary text-sm ml-4">
                          <li>Session Cookies (เพื่อรักษาสถานะการล็อกอิน)</li>
                          <li>Analytics Cookies (Google Analytics 4)</li>
                          <li>Vercel Analytics (สำหรับวิเคราะห์ประสิทธิภาพ)</li>
                          <li>Authentication Tokens (Better Auth)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-content-primary mb-2">2.3 ข้อมูลจาก Third-Party Services:</h3>
                    
                    <div className="space-y-2">
                      <div className="bg-alert-info-bg border border-alert-info-border rounded-lg p-3">
                        <p className="text-sm font-semibold text-alert-info-text mb-1">
                          🔐 Google Sign-In (OAuth):
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-alert-info-text text-sm ml-4">
                          <li>ชื่อ (Name)</li>
                          <li>อีเมล (Email)</li>
                          <li>รูปโปรไฟล์ (Profile Picture)</li>
                          <li>Google Account ID</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Alert className="bg-alert-error-bg border-alert-error-border">
                    <AlertTriangle className="h-4 w-4 text-alert-error-icon" />
                    <AlertDescription className="text-alert-error-text">
                      <strong>⚠️ ข้อห้ามสำคัญ:</strong> เรา<strong>ห้ามเด็ดขาด</strong>การอัปโหลดข้อมูลผู้ป่วยจริง (Real Patient Data)
                      รวมถึง: ชื่อผู้ป่วย, HN, ผลแลป, รูปภาพทางการแพทย์ หรือข้อมูลที่สามารถระบุตัวบุคคลได้
                      <br /><strong>ผลกระทบ:</strong> บัญชีจะถูกระงับทันที
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </motion.div>

            {/* Section 3: Purpose of Use */}
            <motion.div variants={fadeIn}>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-alert-success-icon" />
                    3. วัตถุประสงค์ในการใช้ข้อมูล
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-content-secondary">
                    เราใช้ข้อมูลส่วนบุคคลของคุณเพื่อวัตถุประสงค์ดังต่อไปนี้:
                  </p>

                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-content-primary mb-2 flex items-center gap-2">
                        <span className="text-interactive-primary">1️⃣</span>
                        การให้บริการ (Service Delivery):
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-content-secondary ml-6">
                        <li>สร้างและจัดการบัญชีผู้ใช้</li>
                        <li>รับและพิจารณาคำขอพัฒนาเครื่องมือ</li>
                        <li>พัฒนาเครื่องมือตามคำขอ</li>
                        <li>สื่อสารและให้การสนับสนุน</li>
                        <li>ส่งมอบเครื่องมือและคู่มือการใช้งาน</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-content-primary mb-2 flex items-center gap-2">
                        <span className="text-alert-info-icon">2️⃣</span>
                        การปรับปรุงบริการ (Service Improvement):
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-content-secondary ml-6">
                        <li>วิเคราะห์การใช้งานเพื่อปรับปรุงประสบการณ์ผู้ใช้</li>
                        <li>ทดสอบฟีเจอร์ใหม่</li>
                        <li>แก้ไขข้อบกพร่องและปัญหา</li>
                        <li>พัฒนาเครื่องมือใหม่ๆ</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-content-primary mb-2 flex items-center gap-2">
                        <span className="text-interactive-primary">3️⃣</span>
                        การสื่อสารและแจ้งเตือน (Communication):
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-content-secondary ml-6">
                        <li>แจ้งสถานะคำขอ</li>
                        <li>ส่งการแจ้งเตือนที่สำคัญ</li>
                        <li>ตอบคำถามและให้ความช่วยเหลือ</li>
                        <li>แจ้งการเปลี่ยนแปลงนโยบาย</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-content-primary mb-2 flex items-center gap-2">
                        <span className="text-alert-warning-icon">4️⃣</span>
                        ความปลอดภัยและการป้องกัน (Security):
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-content-secondary ml-6">
                        <li>ป้องกันการฉ้อโกงและการใช้งานที่ผิดกฎหมาย</li>
                        <li>ตรวจจับและแก้ไขปัญหาด้านความปลอดภัย</li>
                        <li>ปฏิบัติตามกฎหมายและข้อบังคับ</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-content-primary mb-2 flex items-center gap-2">
                        <span className="text-interactive-primary">5️⃣</span>
                        การวิเคราะห์และสถิติ (Analytics):
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-content-secondary ml-6">
                        <li>วิเคราะห์พฤติกรรมผู้ใช้ (Google Analytics 4)</li>
                        <li>วัดประสิทธิภาพของบริการ (Vercel Analytics)</li>
                        <li>สร้างรายงานสถิติ (ไม่ระบุตัวตน)</li>
                      </ul>
                    </div>
                  </div>

                  <Alert className="bg-alert-success-bg border-alert-success-border">
                    <Info className="h-4 w-4 text-alert-success-icon" />
                    <AlertDescription className="text-alert-success-text">
                      <strong>หมายเหตุ:</strong> เราจะใช้ข้อมูลของคุณเฉพาะวัตถุประสงค์ที่ระบุไว้เท่านั้น
                      หากมีการใช้เพื่อวัตถุประสงค์อื่น เราจะขอความยินยอมจากคุณก่อน
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </motion.div>

            {/* Section 4: Data Sharing */}
            <motion.div variants={fadeIn}>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-alert-warning-icon" />
                    4. การเปิดเผยและแบ่งปันข้อมูล
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-content-secondary">
                    เรา<strong>ไม่ขาย</strong>ข้อมูลส่วนบุคคลของคุณให้กับบุคคลที่สาม
                    แต่อาจเปิดเผยข้อมูลในกรณีดังต่อไปนี้:
                  </p>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-content-primary mb-2">4.1 ผู้ให้บริการ Third-Party (Service Providers):</h3>
                      
                      <div className="space-y-3">
                        <div className="bg-alert-info-bg border border-alert-info-border rounded-lg p-4">
                          <p className="font-semibold text-alert-info-text mb-2">
                            ☁️ Cloud Hosting & Infrastructure:
                          </p>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <span className="text-alert-info-icon shrink-0">•</span>
                              <div>
                                <strong className="text-alert-info-text">Vercel Inc.</strong>
                                <p className="text-alert-info-text text-xs">
                                  (Hosting, CDN, Analytics) - Singapore
                                </p>
                              </div>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-alert-info-icon shrink-0">•</span>
                              <div>
                                <strong className="text-alert-info-text">Neon Database (PostgreSQL)</strong>
                                <p className="text-alert-info-text text-xs">
                                  (Database) - Singapore
                                </p>
                              </div>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-alert-info-bg border border-alert-info-border rounded-lg p-4">
                          <p className="font-semibold text-alert-info-text mb-2">
                            📊 Analytics & Monitoring:
                          </p>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <span className="text-alert-info-icon shrink-0">•</span>
                              <div>
                                <strong className="text-alert-info-text">Google Analytics 4 (GA4)</strong>
                                <p className="text-alert-info-text text-xs">
                                  (Website Analytics) - Google LLC, Singapore
                                </p>
                              </div>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-alert-info-icon shrink-0">•</span>
                              <div>
                                <strong className="text-alert-info-text">Vercel Analytics</strong>
                                <p className="text-alert-info-text text-xs">
                                  (Performance Monitoring) - Vercel Inc., Singapore
                                </p>
                              </div>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-alert-success-bg border border-alert-success-border rounded-lg p-4">
                          <p className="font-semibold text-alert-success-text mb-2">
                            📧 Email & Communication:
                          </p>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <span className="text-alert-success-icon shrink-0">•</span>
                              <div>
                                <strong className="text-alert-success-text">Gmail (Google Workspace)</strong>
                                <p className="text-alert-success-text text-xs">
                                  (Email Service) - Google LLC, Singapore
                                </p>
                              </div>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-alert-success-icon shrink-0">•</span>
                              <div>
                                <strong className="text-alert-success-text">Amazon SES</strong>
                                <p className="text-alert-success-text text-xs">
                                  (Transactional Email) - Amazon Web Services, Singapore
                                </p>
                              </div>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-alert-warning-bg border border-alert-warning-border rounded-lg p-4">
                          <p className="font-semibold text-alert-warning-text mb-2">
                            🔐 Authentication:
                          </p>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <span className="text-alert-warning-icon shrink-0">•</span>
                              <div>
                                <strong className="text-alert-warning-text">Better Auth</strong>
                                <p className="text-alert-warning-text text-xs">
                                  (Authentication Service) - Open Source Library
                                </p>
                              </div>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-alert-warning-icon shrink-0">•</span>
                              <div>
                                <strong className="text-alert-warning-text">Google OAuth</strong>
                                <p className="text-alert-warning-text text-xs">
                                  (Social Login) - Google LLC, Singapore
                                </p>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <Alert className="bg-alert-warning-bg border-alert-warning-border mt-4">
                        <AlertTriangle className="h-4 w-4 text-alert-warning-icon" />
                        <AlertDescription className="text-alert-warning-text">
                          <strong>หมายเหตุ:</strong> ผู้ให้บริการเหล่านี้ได้รับอนุญาตให้เข้าถึงข้อมูลของคุณ
                          <strong>เฉพาะเพื่อการให้บริการเท่านั้น</strong> และต้องปฏิบัติตามนโยบายความเป็นส่วนตัวของตนเอง
                        </AlertDescription>
                      </Alert>
                    </div>

                    <div>
                      <h3 className="font-semibold text-content-primary mb-2">4.2 การเปิดเผยตามกฎหมาย:</h3>
                      <p className="text-content-secondary mb-2">
                        เราอาจเปิดเผยข้อมูลของคุณหากจำเป็นตามกฎหมาย:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-content-secondary ml-4">
                        <li>ตามคำสั่งศาล หมายศาล หรือกระบวนการทางกฎหมาย</li>
                        <li>เพื่อปฏิบัติตามกฎหมายหรือข้อบังคับ</li>
                        <li>เพื่อป้องกันหรือสืบสวนการฉ้อโกงหรืออาชญากรรม</li>
                        <li>เพื่อคุ้มครองสิทธิ์ ทรัพย์สิน หรือความปลอดภัยของเรา ผู้ใช้ หรือบุคคลอื่น</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-content-primary mb-2">4.3 การโอนธุรกิจ:</h3>
                      <p className="text-content-secondary">
                        หากมีการควบรวม ซื้อกิจการ หรือขายทรัพย์สิน
                        ข้อมูลของคุณอาจถูกโอนไปยังบุคคลที่สาม (เราจะแจ้งให้คุณทราบล่วงหน้า)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Section 5: Data Security */}
            <motion.div variants={fadeIn}>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-alert-error-icon" />
                    5. ความปลอดภัยของข้อมูล
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-content-secondary">
                    เราให้ความสำคัญกับความปลอดภัยของข้อมูลของคุณ และใช้มาตรการดังต่อไปนี้:
                  </p>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-content-primary mb-2">5.1 มาตรการทางเทคนิค:</h3>
                      <ul className="list-disc list-inside space-y-1 text-content-secondary ml-4">
                        <li><strong className="text-content-primary">HTTPS/TLS Encryption:</strong> เข้ารหัสการสื่อสารทั้งหมด</li>
                        <li><strong className="text-content-primary">Password Hashing:</strong> เข้ารหัสรหัสผ่านด้วย bcrypt</li>
                        <li><strong className="text-content-primary">Secure Cookies:</strong> HTTP-only, Secure, SameSite cookies</li>
                        <li><strong className="text-content-primary">Database Encryption:</strong> ข้อมูลใน Database เข้ารหัส at-rest</li>
                        <li><strong className="text-content-primary">Regular Backups:</strong> สำรองข้อมูลอัตโนมัติ</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-content-primary mb-2">5.2 มาตรการทางการบริหารจัดการ:</h3>
                      <ul className="list-disc list-inside space-y-1 text-content-secondary ml-4">
                        <li>จำกัดการเข้าถึงข้อมูลเฉพาะผู้ที่จำเป็น</li>
                        <li>ตรวจสอบและอัปเดตระบบความปลอดภัยสม่ำเสมอ</li>
                        <li>ฝึกอบรมด้านความปลอดภัยข้อมูล</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-content-primary mb-2">5.3 ข้อจำกัด:</h3>
                      <Alert className="border-alert-error-border bg-alert-error-bg">
                        <AlertTriangle className="h-4 w-4 text-alert-error-icon" />
                        <AlertDescription className="text-alert-error-text">
                          <strong>⚠️ คำเตือน:</strong> แม้เราจะใช้มาตรการรักษาความปลอดภัยที่เหมาะสม
                          แต่<strong>ไม่มีระบบใดที่ปลอดภัย 100%</strong>
                          <br />เราไม่สามารถรับประกันความปลอดภัยของข้อมูลอย่างสมบูรณ์
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Section 6: Data Retention */}
            <motion.div variants={fadeIn}>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-interactive-primary" />
                    6. ระยะเวลาเก็บรักษาข้อมูล
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-content-primary mb-2">6.1 นโยบายการเก็บรักษา:</h3>
                    <p className="text-content-secondary mb-3">
                      เราเก็บรักษาข้อมูลของคุณตราบเท่าที่จำเป็นเพื่อวัตถุประสงค์ที่ระบุไว้ หรือตามที่กฎหมายกำหนด:
                    </p>

                    <div className="space-y-2">
                      <div className="bg-surface-secondary rounded-lg p-3">
                        <p className="font-semibold text-content-primary text-sm mb-1">📋 ข้อมูลบัญชีผู้ใช้:</p>
                        <p className="text-content-secondary text-sm">
                          เก็บไว้ตลอดไป (จนกว่าคุณจะขอลบหรือลบบัญชี)
                        </p>
                      </div>

                      <div className="bg-surface-secondary rounded-lg p-3">
                        <p className="font-semibold text-content-primary text-sm mb-1">🔧 ข้อมูลคำขอและเครื่องมือ:</p>
                        <p className="text-content-secondary text-sm">
                          เก็บไว้ตลอดไป (เพื่อประโยชน์ในการพัฒนาและอ้างอิง)
                        </p>
                      </div>

                      <div className="bg-surface-secondary rounded-lg p-3">
                        <p className="font-semibold text-content-primary text-sm mb-1">📊 Logs และ Analytics:</p>
                        <p className="text-content-secondary text-sm">
                          เก็บไว้ 90 วัน (Google Analytics: 14-26 เดือน ตามการตั้งค่า)
                        </p>
                      </div>

                      <div className="bg-surface-secondary rounded-lg p-3">
                        <p className="font-semibold text-content-primary text-sm mb-1">🍪 Cookies:</p>
                        <p className="text-content-secondary text-sm">
                          Session: จนกว่าจะปิด Browser | Persistent: สูงสุด 1 ปี
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-content-primary mb-2">6.2 การลบข้อมูล:</h3>
                    <p className="text-content-secondary">
                      เมื่อข้อมูลไม่จำเป็นอีกต่อไป เราจะลบหรือทำให้ไม่สามารถระบุตัวตนได้ (Anonymization)
                      เว้นแต่กฎหมายกำหนดให้เก็บไว้นานกว่า
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Section 7: Your Rights (PDPA) */}
            <motion.div variants={fadeIn}>
              <Card className="mb-8 border-alert-info-border">
                <CardHeader className="bg-alert-info-bg">
                  <CardTitle className="flex items-center gap-2 text-alert-info-text">
                    <UserX className="w-5 h-5" />
                    7. สิทธิ์ของคุณตาม PDPA
                  </CardTitle>
                </CardHeader>
                <CardContent className="mt-6 space-y-4">
                  <p className="text-content-secondary">
                    ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) คุณมีสิทธิ์ดังต่อไปนี้:
                  </p>

                  <div className="space-y-3">
                    <div className="bg-alert-info-bg border border-alert-info-border rounded-lg p-4">
                      <p className="font-semibold text-alert-info-text mb-2">
                        1️⃣ สิทธิ์ในการเข้าถึงข้อมูล (Right to Access):
                      </p>
                      <p className="text-alert-info-text text-sm">
                        คุณมีสิทธิ์ขอเข้าถึงและขอรับสำเนาข้อมูลส่วนบุคคลของคุณ
                      </p>
                    </div>

                    <div className="bg-alert-success-bg border border-alert-success-border rounded-lg p-4">
                      <p className="font-semibold text-alert-success-text mb-2">
                        2️⃣ สิทธิ์ในการแก้ไข (Right to Rectification):
                      </p>
                      <p className="text-alert-success-text text-sm">
                        คุณมีสิทธิ์ขอแก้ไขข้อมูลที่ไม่ถูกต้องหรือไม่สมบูรณ์
                      </p>
                    </div>

                    <div className="bg-alert-info-bg border border-alert-info-border rounded-lg p-4">
                      <p className="font-semibold text-alert-info-text mb-2">
                        3️⃣ สิทธิ์ในการลบข้อมูล (Right to Erasure):
                      </p>
                      <p className="text-alert-info-text text-sm">
                        คุณมีสิทธิ์ขอให้ลบข้อมูลของคุณในบางกรณี
                        (เว้นแต่เราจำเป็นต้องเก็บตามกฎหมาย)
                      </p>
                    </div>

                    <div className="bg-alert-warning-bg border border-alert-warning-border rounded-lg p-4">
                      <p className="font-semibold text-alert-warning-text mb-2">
                        4️⃣ สิทธิ์ในการคัดค้าน (Right to Object):
                      </p>
                      <p className="text-alert-warning-text text-sm">
                        คุณมีสิทธิ์คัดค้านการประมวลผลข้อมูลของคุณในบางกรณี
                      </p>
                    </div>

                    <div className="bg-alert-error-bg border border-alert-error-border rounded-lg p-4">
                      <p className="font-semibold text-alert-error-text mb-2">
                        5️⃣ สิทธิ์ในการจำกัดการประมวลผล (Right to Restriction):
                      </p>
                      <p className="text-alert-error-text text-sm">
                        คุณมีสิทธิ์ขอจำกัดการประมวลผลข้อมูลของคุณในบางกรณี
                      </p>
                    </div>

                    <div className="bg-alert-info-bg border border-alert-info-border rounded-lg p-4">
                      <p className="font-semibold text-alert-info-text mb-2">
                        6️⃣ สิทธิ์ในการโอนย้ายข้อมูล (Right to Data Portability):
                      </p>
                      <p className="text-alert-info-text text-sm">
                        คุณมีสิทธิ์ขอรับข้อมูลในรูปแบบที่สามารถอ่านได้ด้วยเครื่องและโอนย้ายได้
                      </p>
                    </div>

                    <div className="bg-alert-success-bg border border-alert-success-border rounded-lg p-4">
                      <p className="font-semibold text-alert-success-text mb-2">
                        7️⃣ สิทธิ์ในการถอนความยินยอม (Right to Withdraw Consent):
                      </p>
                      <p className="text-alert-success-text text-sm">
                        คุณมีสิทธิ์ถอนความยินยอมที่ให้ไว้เมื่อใดก็ได้
                      </p>
                    </div>
                  </div>

                  <Alert className="bg-alert-info-bg border-alert-info-border">
                    <Info className="h-4 w-4 text-alert-info-icon" />
                    <AlertDescription className="text-alert-info-text">
                      <strong>วิธีใช้สิทธิ์:</strong> ติดต่อเราทาง thanatouchth@gmail.com หรือ 095-590-4245
                      <br />เราจะดำเนินการภายใน <strong>30 วัน</strong> นับจากวันที่ได้รับคำขอ (ฟรี!)
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </motion.div>

            {/* Section 8: Cookies */}
            <motion.div variants={fadeIn}>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cookie className="w-5 h-5 text-alert-warning-icon" />
                    8. นโยบาย Cookies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-content-primary mb-2">8.1 Cookies คืออะไร?</h3>
                    <p className="text-content-secondary">
                      Cookies คือไฟล์ข้อความขนาดเล็กที่เว็บไซต์จัดเก็บบบนอุปกรณ์ของคุณ
                      เพื่อจดจำข้อมูลบางอย่างเกี่ยวกับการเยี่ยมชมของคุณ
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-content-primary mb-2">8.2 ประเภท Cookies ที่เราใช้:</h3>
                    
                    <div className="space-y-2">
                      <div className="bg-alert-success-bg border border-alert-success-border rounded-lg p-3">
                        <p className="font-semibold text-alert-success-text text-sm mb-1">
                          ✅ Essential Cookies (จำเป็น):
                        </p>
                        <p className="text-alert-success-text text-sm">
                          รักษาสถานะการล็อกอิน, ความปลอดภัย, การทำงานพื้นฐาน
                          <br /><strong>ไม่สามารถปฏิเสธได้</strong> - จำเป็นสำหรับการทำงานของเว็บไซต์
                        </p>
                      </div>

                      <div className="bg-alert-info-bg border border-alert-info-border rounded-lg p-3">
                        <p className="font-semibold text-alert-info-text text-sm mb-1">
                          📊 Analytics Cookies (การวิเคราะห์):
                        </p>
                        <p className="text-alert-info-text text-sm">
                          Google Analytics 4 (GA4), Vercel Analytics
                          <br /><strong>สามารถปฏิเสธได้</strong> - ใช้วิเคราะห์การใช้งานเพื่อปรับปรุงบริการ
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-content-primary mb-2">8.3 การจัดการ Cookies:</h3>
                    <p className="text-content-secondary mb-2">
                      คุณสามารถจัดการหรือลบ Cookies ได้ผ่านการตั้งค่า Browser:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-content-secondary ml-4 text-sm">
                      <li>Chrome: Settings → Privacy and Security → Cookies</li>
                      <li>Firefox: Settings → Privacy & Security → Cookies</li>
                      <li>Safari: Preferences → Privacy → Cookies</li>
                    </ul>
                    <Alert className="bg-alert-warning-bg border-alert-warning-border mt-3">
                      <AlertTriangle className="h-4 w-4 text-alert-warning-icon" />
                      <AlertDescription className="text-alert-warning-text text-sm">
                        <strong>หมายเหตุ:</strong> การปิด Essential Cookies อาจทำให้บางฟีเจอร์ทำงานไม่ได้
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Section 9: International Transfer */}
            <motion.div variants={fadeIn}>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-interactive-primary" />
                    9. การโอนข้อมูลข้ามประเทศ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-content-secondary">
                    ข้อมูลของคุณอาจถูกโอนและจัดเก็บในเซิร์ฟเวอร์ที่ตั้งอยู่นอกประเทศไทย
                    โดยเฉพาะ<strong> Singapore</strong> เนื่องจากผู้ให้บริการ Cloud ของเรา
                  </p>

                  <div>
                    <h3 className="font-semibold text-content-primary mb-2">มาตรการคุ้มครอง:</h3>
                    <ul className="list-disc list-inside space-y-1 text-content-secondary ml-4">
                      <li>ใช้ผู้ให้บริการที่มีมาตรฐานสากล (ISO 27001, SOC 2, GDPR Compliant)</li>
                      <li>เข้ารหัสข้อมูลทั้งในขณะส่ง (in-transit) และจัดเก็บ (at-rest)</li>
                      <li>จำกัดการเข้าถึงข้อมูลเฉพาะผู้ที่จำเป็น</li>
                    </ul>
                  </div>

                  <Alert className="bg-alert-info-bg border-alert-info-border">
                    <Shield className="h-4 w-4 text-alert-info-icon" />
                    <AlertDescription className="text-alert-info-text">
                      <strong>การใช้บริการถือว่าคุณยินยอม</strong>ให้โอนข้อมูลไปยัง Singapore
                      และประเทศอื่นๆ ที่ผู้ให้บริการของเราตั้งอยู่
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </motion.div>

            {/* Section 10: Children's Privacy */}
            <motion.div variants={fadeIn}>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>10. ความเป็นส่วนตัวของเด็ก</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-content-secondary">
                    บริการของเราไม่ได้มุ่งเป้าไปที่เด็กอายุต่ำกว่า 18 ปี
                    เราไม่เจตนาเก็บรวบรวมข้อมูลส่วนบุคคลจากเด็ก
                  </p>

                  <Alert className="border-alert-error-border bg-alert-error-bg">
                    <AlertTriangle className="h-4 w-4 text-alert-error-icon" />
                    <AlertDescription className="text-alert-error-text">
                      หากคุณเป็นผู้ปกครองและพบว่าบุตรหลานของคุณให้ข้อมูลส่วนบุคคลแก่เรา
                      กรุณาติดต่อเราทันที เราจะลบข้อมูลนั้นโดยเร็วที่สุด
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </motion.div>

            {/* Section 11: Policy Updates */}
            <motion.div variants={fadeIn}>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>11. การเปลี่ยนแปลงนโยบาย</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-content-secondary">
                    เราสงวนสิทธิ์ในการแก้ไขนโยบายนี้ได้ตลอดเวลา
                    โดยจะแจ้งให้ทราบผ่านช่องทางดังต่อไปนี้:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-content-secondary ml-4">
                    <li>ประกาศบนแพลตฟอร์ม (อัปเดต &quot;วันที่มีผลบังคับใช้&quot;)</li>
                    <li>อีเมลแจ้งผู้ใช้ (กรณีเปลี่ยนแปลงสำคัญ)</li>
                  </ul>
                  <p className="text-content-secondary">
                    การใช้บริการต่อหลังจากมีการแก้ไข ถือว่าคุณยอมรับนโยบายฉบับใหม่
                    <br />แนะนำให้ตรวจสอบนโยบายเป็นประจำ
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact */}
            <motion.div variants={fadeIn}>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>12. ติดต่อเรา</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-content-secondary">
                    หากมีข้อสงสัยเกี่ยวกับนโยบายนี้ หรือต้องการใช้สิทธิ์ตาม PDPA กรุณาติดต่อ:
                  </p>

                  <div className="bg-surface-secondary rounded-lg p-4 space-y-2">
                    <p className="font-semibold text-content-primary">NextHealTH Sandbox</p>
                    <p className="text-sm text-content-tertiary">
                      ผู้ควบคุมข้อมูลส่วนบุคคล (Data Controller)
                    </p>
                    <p className="text-sm text-content-tertiary">Phitsanulok, Thailand 65000</p>
                    <div className="pt-2 space-y-1">
                      <p className="text-sm">
                        <strong>อีเมล:</strong>{' '}
                        <a href="mailto:thanatouchth@gmail.com" className="text-interactive-primary hover:opacity-80">
                          thanatouchth@gmail.com
                        </a>
                      </p>
                      <p className="text-sm">
                        <strong>โทรศัพท์:</strong>{' '}
                        <a href="tel:0955904245" className="text-interactive-primary hover:opacity-80">
                          095-590-4245
                        </a>
                      </p>
                      <p className="text-sm text-content-tertiary">
                        (วันจันทร์-ศุกร์ เวลา 09:00-17:00 น.)
                      </p>
                    </div>
                  </div>

                  <Alert className="bg-alert-info-bg border-alert-info-border">
                    <Info className="h-4 w-4 text-alert-info-icon" />
                    <AlertDescription className="text-alert-info-text">
                      <strong>ระยะเวลาตอบกลับ:</strong> เราจะดำเนินการตามคำขอของคุณภายใน 30 วัน
                      (ตามที่ PDPA กำหนด) โดยไม่เสียค่าใช้จ่าย
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </motion.div>

            {/* Footer */}
            <motion.div variants={fadeIn} className="text-center pt-8 border-t border-border-primary">
              <p className="text-sm text-content-secondary">
                นโยบายความเป็นส่วนตัวฉบับนี้มีผลบังคับใช้ตั้งแต่วันที่ 26 มกราคม 2568 เป็นต้นไป
              </p>
              <p className="text-xs text-content-tertiary mt-2">
                © 2025 NextHealTH Sandbox - Educational & Experimental Use Only
              </p>
              <p className="text-xs text-content-tertiary mt-1">
                เราให้ความสำคัญกับความเป็นส่วนตัวของคุณ 🛡️
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}