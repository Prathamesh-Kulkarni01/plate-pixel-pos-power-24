
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share } from "lucide-react";

interface QRCodeDisplayProps {
  tableNumber: string;
  qrCode: string;
  restaurantName: string;
}

const QRCodeDisplay = ({ tableNumber, qrCode, restaurantName }: QRCodeDisplayProps) => {
  // Generate QR code URL - in a real app, you'd use a QR code library
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.origin}/customer/${qrCode}`)}`;
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `table-${tableNumber}-qr.png`;
    link.click();
  };

  const handleShare = async () => {
    const customerUrl = `${window.location.origin}/customer/${qrCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${restaurantName} - Table ${tableNumber}`,
          text: `Order from Table ${tableNumber} at ${restaurantName}`,
          url: customerUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(customerUrl);
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardContent className="p-6 text-center space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Table {tableNumber}</h3>
          <p className="text-sm text-muted-foreground">{restaurantName}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border inline-block">
          <img 
            src={qrCodeUrl} 
            alt={`QR Code for Table ${tableNumber}`}
            className="w-48 h-48"
          />
        </div>
        
        <div className="text-xs text-muted-foreground">
          Scan to order from this table
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeDisplay;
