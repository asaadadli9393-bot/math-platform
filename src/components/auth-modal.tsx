"use client";

// ============================================================
//  @/components/auth-modal.tsx — نافذة تسجيل الدخول/التسجيل
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Mail, Lock, User, Phone, MapPin } from "lucide-react";
import { loginUser, registerUser, type AuthUser } from "@/lib/auth-client";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onAuth: (user: AuthUser) => void;
}

export function AuthModal({ open, onClose, onAuth }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // حقول تسجيل الدخول
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // حقول التسجيل
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regCity, setRegCity] = useState("");
  const [regStream, setRegStream] = useState("EXPERIMENTAL_SCIENCES");

  async function handleLogin() {
    setError(null);
    if (!loginEmail || !loginPassword) {
      setError("البريد وكلمة السر مطلوبان");
      return;
    }
    setLoading(true);
    const result = await loginUser(loginEmail, loginPassword);
    setLoading(false);
    if (result.success && result.user && result.token) {
      onAuth(result.user);
      onClose();
      // إعادة تعيين الحقول
      setLoginEmail("");
      setLoginPassword("");
    } else {
      setError(result.error || "فشل تسجيل الدخول");
    }
  }

  async function handleRegister() {
    setError(null);
    if (!regName || !regEmail || !regPassword) {
      setError("جميع الحقول الأساسية مطلوبة");
      return;
    }
    setLoading(true);
    const result = await registerUser({
      name: regName,
      email: regEmail,
      password: regPassword,
      phone: regPhone,
      city: regCity,
      stream: regStream,
    });
    setLoading(false);
    if (result.success && result.user && result.token) {
      onAuth(result.user);
      onClose();
      // إعادة تعيين الحقول
      setRegName("");
      setRegEmail("");
      setRegPassword("");
      setRegPhone("");
      setRegCity("");
    } else {
      setError(result.error || "فشل التسجيل");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">حساب الطالب</DialogTitle>
          <DialogDescription className="text-center">
            سجّل دخولك أو أنشئ حسابًا للمتابعة
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => { setTab(v as "login" | "register"); setError(null); }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
            <TabsTrigger value="register">حساب جديد</TabsTrigger>
          </TabsList>

          {/* تسجيل الدخول */}
          <TabsContent value="login" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="example@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="pr-10"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">كلمة السر</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="pr-10"
                  dir="ltr"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                {error}
              </div>
            )}
            <Button onClick={handleLogin} disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              تسجيل الدخول
            </Button>
          </TabsContent>

          {/* التسجيل */}
          <TabsContent value="register" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reg-name">الاسم الكامل</Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reg-name"
                  type="text"
                  placeholder="محمد أمين"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="example@email.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="pr-10"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-password">كلمة السر</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reg-password"
                  type="password"
                  placeholder="6 أحرف على الأقل (حروف + أرقام)"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="pr-10"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="reg-phone">الهاتف (اختياري)</Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reg-phone"
                    type="tel"
                    placeholder="0555 12 34 56"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="pr-10"
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-city">المدينة (اختياري)</Label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reg-city"
                    type="text"
                    placeholder="الجزائر"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>الشعبة</Label>
              <Select value={regStream} onValueChange={setRegStream}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXPERIMENTAL_SCIENCES">علوم تجريبية</SelectItem>
                  <SelectItem value="MATHEMATICS">رياضيات</SelectItem>
                  <SelectItem value="TECHNICAL_MATH">تقني رياضي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                {error}
              </div>
            )}
            <Button onClick={handleRegister} disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              إنشاء الحساب
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
