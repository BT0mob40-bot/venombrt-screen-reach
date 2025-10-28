import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Folder, Download, Upload, Trash2 } from "lucide-react";

const FileManager = () => {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            File Manager
          </h1>
          <p className="text-muted-foreground">
            Browse and manage files on connected devices
          </p>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 bg-card border-border mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Selected
            </Button>
            <Button variant="outline">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        </Card>

        {/* File Browser */}
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            /sdcard/
          </h2>
          <div className="space-y-2">
            {[
              { name: "DCIM", type: "folder", size: "-" },
              { name: "Download", type: "folder", size: "-" },
              { name: "Documents", type: "folder", size: "-" },
              { name: "screenshot.png", type: "file", size: "2.4 MB" },
              { name: "data.json", type: "file", size: "124 KB" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {item.type === "folder" ? (
                    <Folder className="w-5 h-5 text-primary" />
                  ) : (
                    <FileText className="w-5 h-5 text-primary" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.size}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FileManager;
