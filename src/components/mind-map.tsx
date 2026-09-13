"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Download, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { curriculum } from "@/data/curriculum";

// ============================================================
//  MindMap — خريطة ذهنية تفاعلية لكل وحدة
//  منصة الرياضيات | الأستاذ عدلي أسعد
//  مستوحى من XMind — عرض هرمي تفاعلي
// ============================================================

interface MindNode {
  id: string;
  label: string;
  color: string;
  children?: MindNode[];
  level: number;
}

export function MindMapView({ unitSlug, onNavigate }: { unitSlug?: string; onNavigate?: (slug: string) => void }) {
  const [selectedUnit, setSelectedUnit] = React.useState<string>(unitSlug || curriculum[0].slug);
  const [zoom, setZoom] = React.useState(1);
  const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(new Set());

  // بناء شجرة الخريطة الذهنية من بيانات المنهاج
  const buildMindTree = (unit: typeof curriculum[0]): MindNode => {
    return {
      id: unit.slug,
      label: unit.title,
      color: unit.color,
      level: 0,
      children: unit.chapters.map((chapter) => ({
        id: chapter.slug,
        label: chapter.title,
        color: unit.color,
        level: 1,
        children: chapter.lessons.map((lesson) => ({
          id: lesson.slug,
          label: lesson.title,
          color: unit.color,
          level: 2,
          children: lesson.keyPoints?.map((kp, i) => ({
            id: `${lesson.slug}-kp-${i}`,
            label: kp,
            color: unit.color,
            level: 3,
          })) || [],
        })),
      })),
    };
  };

  const unit = curriculum.find((u) => u.slug === selectedUnit);
  if (!unit) return null;
  const tree = buildMindTree(unit);

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // افتراضياً، نوسّع المستوى الأول
  React.useEffect(() => {
    const first = new Set<string>();
    unit.chapters.forEach((ch) => first.add(ch.slug));
    setExpandedNodes(first);
  }, [selectedUnit]);

  return (
    <div className="space-y-4">
      {/* اختيار الوحدة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-primary" />
            الخريطة الذهنية
          </CardTitle>
          <CardDescription>
            خريطة ذهنية تفاعلية لكل وحدة — اضغط على العقد للتوسيع/الطي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {curriculum.map((u) => (
              <Button
                key={u.slug}
                size="sm"
                variant={selectedUnit === u.slug ? "default" : "outline"}
                onClick={() => setSelectedUnit(u.slug)}
                style={selectedUnit === u.slug ? { backgroundColor: u.color } : {}}
              >
                {u.title}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* أدوات التكبير */}
      <div className="flex items-center justify-between">
        <Badge variant="outline">{unit.title}</Badge>
        <div className="flex gap-2">
          <Button size="icon" variant="outline" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="outline" onClick={() => setZoom(1)}>
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="outline" onClick={() => setZoom(Math.min(2, zoom + 0.1))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* الخريطة الذهنية */}
      <Card className="overflow-auto" style={{ maxHeight: "70vh" }}>
        <CardContent className="p-6" style={{ transform: `scale(${zoom})`, transformOrigin: "top right" }}>
          <MindTree
            node={tree}
            expandedNodes={expandedNodes}
            onToggle={toggleNode}
            onNavigate={onNavigate}
          />
        </CardContent>
      </Card>

      {/* دليل الاستعمال */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="text-sm text-blue-800 space-y-1">
            <p>📋 <strong>كيفية الاستعمال:</strong></p>
            <ul className="list-disc pr-5 space-y-1">
              <li>اضغط على أي عقدة <strong>للتوسيع/الطي</strong></li>
              <li>استعمل <strong>+/−</strong> للتكبير/التصغير</li>
              <li>اضغط على درس <strong>للانتقال إليه</strong></li>
              <li>غيّر الوحدة من الأزرار العلوية</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
//  MindTree — عرض شجرة الخريطة الذهنية
// ============================================================

function MindTree({
  node,
  expandedNodes,
  onToggle,
  onNavigate,
  depth = 0,
}: {
  node: MindNode;
  expandedNodes: Set<string>;
  onToggle: (id: string) => void;
  onNavigate?: (slug: string) => void;
  depth?: number;
}) {
  const isExpanded = expandedNodes.has(node.id);
  const hasChildren = node.children && node.children.length > 0;

  // ألوان حسب المستوى
  const levelColors = [
    "bg-gradient-to-r from-primary to-accent text-white",
    "bg-primary/10 border-2 border-primary/30 text-primary",
    "bg-accent/10 border border-accent/30 text-accent-foreground",
    "bg-muted text-muted-foreground",
  ];

  const sizes = [
    "text-lg px-6 py-3",
    "text-base px-4 py-2",
    "text-sm px-3 py-1.5",
    "text-xs px-2 py-1",
  ];

  const margins = [
    "mr-0",
    "mr-8",
    "mr-16",
    "mr-24",
  ];

  return (
    <div className={`${margins[depth] || margins[3]} transition-all`}>
      {/* العقدة */}
      <div
        className={`inline-flex items-center gap-2 rounded-lg ${sizes[depth] || sizes[3]} ${levelColors[depth] || levelColors[3]} cursor-pointer hover:shadow-md transition-all ${
          hasChildren ? "" : "cursor-default"
        }`}
        onClick={() => {
          if (hasChildren) {
            onToggle(node.id);
          } else if (depth === 2 && onNavigate) {
            onNavigate(node.id);
          }
        }}
      >
        {hasChildren && (
          <span className="text-xs">
            {isExpanded ? "▼" : "▶"}
          </span>
        )}
        <span className="font-medium">{node.label}</span>
      </div>

      {/* الأطفال */}
      {hasChildren && isExpanded && (
        <div className="mt-2 space-y-2 border-r-2 border-primary/20 pr-4">
          {node.children!.map((child) => (
            <MindTree
              key={child.id}
              node={child}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
//  MindMapGenerator — توليد خرائط ذهنية من نص
//  يولّد بنية JSON يمكن استيرادها في XMind
// ============================================================

export function MindMapExport({ unitSlug }: { unitSlug: string }) {
  const unit = curriculum.find((u) => u.slug === unitSlug);

  if (!unit) return null;

  // توليد صيغة OPML (يمكن استيرادها في XMind و أدوات أخرى)
  const generateOPML = () => {
    const buildNode = (label: string, children: string[] = []): string => {
      return `<outline text="${label}">${children.length > 0 ? children.join("") : ""}</outline>`;
    };

    const chapters = unit.chapters.map((ch) => {
      const lessons = ch.lessons.map((l) => {
        const kps = (l.keyPoints || []).map((kp) => buildNode(kp));
        return buildNode(l.title, kps);
      });
      return buildNode(ch.title, lessons);
    });

    const opml = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
<head>
<title>${unit.title} — خريطة ذهنية</title>
</head>
<body>
${buildNode(unit.title, chapters)}
</body>
</opml>`;

    return opml;
  };

  // توليد صيغة FreeMind (.mm)
  const generateFreeMind = () => {
    const buildNode = (label: string, color: string, children: { label: string; color: string }[] = []): string => {
      return `<node TEXT="${label}" COLOR="${color}">${
        children.length > 0 ? children.map((c) => buildNode(c.label, c.color)).join("") : ""
      }</node>`;
    };

    const chapters = unit.chapters.map((ch) => ({
      label: ch.title,
      color: unit.color,
    }));

    return `<?xml version="1.0" encoding="UTF-8"?>
<map version="1.0.1">
${buildNode(unit.title, unit.color, chapters)}
</map>`;
  };

  // تحميل الملف
  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        size="sm"
        variant="outline"
        onClick={() => downloadFile(generateOPML(), `${unit.slug}-mindmap.opml`, "text/xml")}
        className="gap-1"
      >
        <Download className="w-3 h-3" />
        تحميل OPML (XMind)
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => downloadFile(generateFreeMind(), `${unit.slug}-mindmap.mm`, "text/xml")}
        className="gap-1"
      >
        <Download className="w-3 h-3" />
        تحميل FreeMind
      </Button>
    </div>
  );
}
