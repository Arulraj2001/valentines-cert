import html2canvas from "html2canvas";
import { FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin } from "react-icons/fa";
import { toast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Static imports of images from the public directory
const boyGivingHeart = "/5.png"; // Not used as per instruction 1
const girlReceivingHeart = "/6.png";
const marriedCouple = "/mar.png";
const singleImageFile = "/3.png"; // Renamed to avoid variable name conflict

type Status = "committed" | "single" | "married";

const committedQuotes = [
  "Together is a beautiful place to be ❤️",
  "Every love story is beautiful, but ours is my favorite 💑",
  "You're still the one I want to annoy for the rest of my life 😊",
  "In you, I've found the love of my life and my closest friend 💕",
  "You make every day worth living 💖",
];

const singleQuotes = [
  "Single and loving it! Self-love is the best love 💪",
  "Not single, just in a long-term relationship with freedom 🦋",
  "Single = Self-sufficient and fabulous! ✨",
  "Living my best life, no plus one needed 🌟",
  "Single but not available for nonsense 💅",
];

const marriedQuotes = [
  "Happy Marriage Anniversary and Happy Valentine's Day! 🎉",
  "Still the best decision I ever made. Happy Valentine's Day, my spouse! ❤️",
  "To my partner in life and love, Happy Valentine's Day! 🥂",
  "Our marriage is the sweetest love story. Happy Valentine's Day! 💖",
  "Growing old together, hand in hand. Happy Valentine's Day! 🌹",
];

const committedPoems = [
  "In your arms, I've found my home,\nNever to roam, never alone.",
  "Two hearts entwined, a perfect blend,\nOur journey of love, may it never end.",
  "With every beat, my heart sings true,\nForever and always, I'm in love with you.",
];

const singlePoems = [
  "My heart is free, my spirit light,\nCelebrating self, this Valentine's night.",
  "In solitude, I find my strength,\nMy own love story, of infinite length.",
  "Independent soul, with dreams untold,\nMy Valentine's gift, is to myself, bold.",
];

const marriedPoems = [
  "Years have flown, our love's still new,\nEach Valentine's Day, I cherish you.",
  "Through every season, hand in hand we stride,\nMy beloved spouse, my Valentine, my pride.",
  "A lifetime of love, a bond so deep,\nIn your embrace, my heart to keep.",
];


const FloatingEmojis = () => {
  useEffect(() => {
    const createFloatingEmoji = (emoji: string) => {
      const element = document.createElement('div');
      element.className = `animate-emoji-float floating-emoji`;
      element.innerText = emoji;
      element.style.left = `${Math.random() * 100}vw`;
      element.style.animationDelay = `${Math.random() * 10}s`;
      element.style.fontSize = `${20 + Math.random() * 30}px`;
      element.style.opacity = `${0.5 + Math.random() * 0.5}`;
      document.getElementById('emoji-container')?.appendChild(element);

      setTimeout(() => {
        element.remove();
      }, 15000);
    };

    const emojis = ['❤️', '💖', '💘', '💝', '💕', '💞', '😍', '🥰', '😘'];
    const interval = setInterval(() => {
      createFloatingEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <div id="emoji-container" className="fixed inset-0 pointer-events-none overflow-hidden z-0" />;
};


const FloatingElements = () => {
  useEffect(() => {
    const createFloatingElement = (type: string) => {
      const element = document.createElement('div');
      element.className = `animate-float float-3 ${type}`;
      element.style.left = `${Math.random() * 100}vw`;
      element.style.animationDelay = `${Math.random() * 10}s`;
      document.getElementById('floating-container')?.appendChild(element);

      setTimeout(() => {
        element.remove();
      }, 15000);
    };

    const types = ['bg-hearts', 'bg-roses', 'bg-chocolates', 'bg-love'];
    const interval = setInterval(() => {
      createFloatingElement(types[Math.floor(Math.random() * types.length)]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div id="floating-container" className="fixed inset-0 pointer-events-none overflow-hidden" />;
};

export default function Certificate() {
  const [status, setStatus] = useState<Status | null>(null);
  const [yourName, setYourName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [message, setMessage] = useState("");
  const [commitmentDate, setCommitmentDate] = useState("");
  const [marriageDate, setMarriageDate] = useState("");
  const [selectedQuote, setSelectedQuote] = useState("");
  const [showShareOptions, setShowShareOptions] = useState(false);
  const todayDate = new Date().toLocaleDateString();
  const [singleImage, setSingleImage] = useState<string | null>(singleImageFile); // Initialize with the path from public

  const handleStatusChange = (newStatus: Status) => {
    setStatus(newStatus);
    setMessage("");
    setSelectedQuote("");
    setSingleImage(null);
    if (newStatus === 'single') {
        setSingleImage(singleImageFile);
    } else {
        setSingleImage(null);
    }
    if (newStatus !== "committed" && newStatus !== "married") {
      setPartnerName("");
      setCommitmentDate("");
      setMarriageDate("");
    }
  };

  const calculateDays = (startDate: Date | null) => {
    if (!startDate) return null;
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleQuoteSelect = (quote: string) => {
    setMessage(quote);
    toast({
      title: "Quote Selected!",
      description: "The quote has been added to your message.",
    });
  };

  const handleDownload = async () => {
    if (!yourName) {
      toast({
        title: "Error",
        description: "Please enter your name to generate the certificate.",
        variant: "destructive",
      });
      return;
    }
    if (!status) {
      toast({
        title: "Error",
        description: "Please select your status to generate the certificate.",
        variant: "destructive",
      });
      return;
    }
    if ((status === 'committed' || status === 'married') && !partnerName) {
      toast({
        title: "Error",
        description: "Please enter your partner's name.",
        variant: "destructive",
      });
      return;
    }
     if (status === 'committed' && !commitmentDate) {
      toast({
        title: "Error",
        description: "Please select your commitment date.",
        variant: "destructive",
      });
      return;
    }
    if (status === 'married' && !marriageDate) {
      toast({
        title: "Error",
        description: "Please select your marriage date.",
        variant: "destructive",
      });
      return;
    }

    // Payment Check - Replace this with actual payment integration in real app
    const paymentConfirmed = window.confirm("To download the certificate, please make a payment of ₹10 by scanning the QR code and then press OK. \n\n (This is a simulation. No actual payment is processed.) \n\n <QR Code Image Here - In real app, display QR code for ₹10 payment>");

    if (!paymentConfirmed) {
      toast({
        title: "Download Cancelled",
        description: "Payment is required to download the certificate.",
        variant: "destructive",
      });
      return;
    }


    const certificateElement = document.createElement('div');
    certificateElement.id = "certificate-temp"; //temp id for html2canvas
    certificateElement.className = "certificate-border certificate-bg-love p-8 text-center space-y-4 relative overflow-hidden";

    // Stickers for Certificate
    const stickerHeart = document.createElement('div');
    stickerHeart.className = "sticker sticker-heart";
    stickerHeart.style.top = '10px';
    stickerHeart.style.left = '20px';
    stickerHeart.innerText = '❤️';
    certificateElement.appendChild(stickerHeart);

    const stickerRose = document.createElement('div');
    stickerRose.className = "sticker sticker-rose";
    stickerRose.style.bottom = '20px';
    stickerRose.style.right = '30px';
    stickerRose.style.transform = 'rotate(-15deg)';
    stickerRose.innerText = '🌹';
    certificateElement.appendChild(stickerRose);

    const stickerSparkle = document.createElement('div');
    stickerSparkle.className = "sticker sticker-sparkle";
    stickerSparkle.style.top = '50%';
    stickerSparkle.style.right = '10px';
    stickerSparkle.style.transform = 'translateY(-50%) rotate(25deg)';
    stickerSparkle.innerText = '✨';
    certificateElement.appendChild(stickerSparkle);


    if (status === "committed") {
        const imgCouple = document.createElement('img');
        imgCouple.src = girlReceivingHeart;
        imgCouple.alt = "Committed Couple";
        imgCouple.className = "h-32 opacity-70"; // Reduced opacity to put image in background
        const divCouple = document.createElement('div');
        divCouple.className = "absolute top-1/4 left-1/2 transform -translate-x-1/2 certificate-image z-0"; // Centered and behind text
        divCouple.appendChild(imgCouple);
        certificateElement.appendChild(divCouple);


    } else if (status === "married") {
        const imgMarried = document.createElement('img');
        imgMarried.src = marriedCouple;
        imgMarried.alt = "Married Couple";
        imgMarried.className = "h-40 opacity-70"; // Reduced opacity
        const divMarried = document.createElement('div');
        divMarried.className = "absolute top-1/4 left-1/2 transform -translate-x-1/2 certificate-image z-0"; // Centered and behind text
        divMarried.appendChild(imgMarried);
        certificateElement.appendChild(divMarried);
    } else if (status === "single" && singleImage) {
        const imgSingle = document.createElement('img');
        imgSingle.src = singleImage;
        imgSingle.alt = "Proudly Single";
        imgSingle.className = "h-40 opacity-65"; // Reduced opacity
        const divSingle = document.createElement('div');
        divSingle.className = "absolute top-1/4 left-1/2 transform -translate-x-1/2 opacity-90 certificate-image z-0"; // Centered and behind text
        divSingle.appendChild(imgSingle);
        certificateElement.appendChild(divSingle);
    }


    const h2Title = document.createElement('h2');
    h2Title.className = "text-3xl font-serif neon-text z-10 relative"; // Increased z-index for text
    h2Title.innerText = "Valentine's Day 2025";
    certificateElement.appendChild(h2Title);

    const pCertifies = document.createElement('p');
    pCertifies.className = "text-lg text-love-800 font-medium z-10 relative"; // Increased z-index for text
    pCertifies.innerText = `Certificate of ${status === "married" ? "Marriage" : "Love"}`;
    certificateElement.appendChild(pCertifies);

    const pThisCertifies = document.createElement('p');
    pThisCertifies.className = "text-love-800 z-10 relative"; // Increased z-index for text
    pThisCertifies.innerText = "This certifies that";
    certificateElement.appendChild(pThisCertifies);

    const h3Names = document.createElement('h3');
    h3Names.className = "text-xl font-bold neon-text z-10 relative"; // Increased z-index for text
    h3Names.innerText = `${yourName} ${(status === "committed" || status === "married") && partnerName ? ` & ${partnerName}` : ''}`;
    certificateElement.appendChild(h3Names);

    const pStatusDetail = document.createElement('p');
    pStatusDetail.className = "text-love-800 z-10 relative"; // Increased z-index for text
    if (status === "committed") {
        pStatusDetail.innerText = "are committed to each other";
    } else if (status === "single") {
        pStatusDetail.innerText = "is proudly single";
    } else if (status === "married") {
        pStatusDetail.innerText = "are happily married";
    }
    certificateElement.appendChild(pStatusDetail);

    if (status === "committed" && commitmentDate) {
        const pCommitmentDate = document.createElement('p');
        pCommitmentDate.className = "text-love-700 z-10 relative"; // Increased z-index for text
        pCommitmentDate.innerText = `Since ${new Date(commitmentDate).toLocaleDateString()}`;
        certificateElement.appendChild(pCommitmentDate);

        const pDaysOfLove = document.createElement('p');
        pDaysOfLove.className = "text-love-700 font-bold z-10 relative"; // Increased z-index for text
        pDaysOfLove.innerText = `${calculateDays(commitmentDate ? new Date(commitmentDate) : null)} days of love ❤️`;
        certificateElement.appendChild(pDaysOfLove);
    }

    if (status === "married" && marriageDate) {
        const pMarriageDate = document.createElement('p');
        pMarriageDate.className = "text-love-700 z-10 relative"; // Increased z-index for text
        pMarriageDate.innerText = `Since ${new Date(marriageDate).toLocaleDateString()}`;
        certificateElement.appendChild(pMarriageDate);

        const pYearsOfMarriage = document.createElement('p');
        pYearsOfMarriage.className = "text-love-700 font-bold z-10 relative"; // Increased z-index for text
        pYearsOfMarriage.innerText = `Celebrating years of marriage ❤️`;
        certificateElement.appendChild(pYearsOfMarriage);
    }

    const pTodayDate = document.createElement('p');
    pTodayDate.className = "text-love-700 z-10 relative"; // Increased z-index for text
    pTodayDate.innerText = `Today's Date: ${todayDate}`;
    certificateElement.appendChild(pTodayDate);


    if (message) {
        const pMessage = document.createElement('p');
        pMessage.className = "italic text-love-700 mt-4 z-10 relative"; // Increased z-index for text
        pMessage.innerText = `"${message}"`;
        certificateElement.appendChild(pMessage);
    }

    const poemSection = document.createElement('div');
    poemSection.className = "mt-4 poem-section text-love-700 z-10 relative"; // Increased z-index for text
    const pPoemTitle = document.createElement('p');
    pPoemTitle.className = "italic";
    pPoemTitle.innerText = "Poem for you:";
    poemSection.appendChild(pPoemTitle);
    const pPoemText = document.createElement('p');
    pPoemText.className = "poem-text";
    pPoemText.innerText = getPoemByStatus();
    poemSection.appendChild(pPoemText);
    certificateElement.appendChild(poemSection);


    const pWebsiteLink = document.createElement('p');
    pWebsiteLink.className = "website-link absolute bottom-4 left-4 text-love-500 text-sm z-10 relative"; // Increased z-index for text
    pWebsiteLink.innerText = "https://valentines-cert.vercel.app/"; // Replace with your website link
    certificateElement.appendChild(pWebsiteLink);


    document.body.appendChild(certificateElement); // Append to body to render it

    const tempCertificateElement = document.getElementById("certificate-temp");


    if (tempCertificateElement) {
      try {
        const canvas = await html2canvas(tempCertificateElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#fef0f9",
        });
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "Valentine_Certificate.png";
        link.click();

        toast({
          title: "Certificate Downloaded!",
          description: "Your Valentine's Day certificate with design has been saved.",
        });
      } catch (error) {
        console.error("Error generating or downloading certificate:", error);
        toast({
          title: "Download Failed",
          description: "Could not download the certificate. Please try again.",
          variant: "destructive",
        });
      } finally {
        document.body.removeChild(tempCertificateElement); // Remove temp element after download
      }
    } else {
      toast({
        title: "Error",
        description: "Failed to generate the certificate. Please try again!",
        variant: "destructive",
      });
    }
  };


  const getQuotesByStatus = () => {
    switch (status) {
      case "committed":
        return committedQuotes;
      case "single":
        return singleQuotes;
      case "married":
        return marriedQuotes;
      default:
        return [];
    }
  };

  const getPoemByStatus = () => {
    switch (status) {
      case "committed":
        return committedPoems[Math.floor(Math.random() * committedPoems.length)];
      case "single":
        return singlePoems[Math.floor(Math.random() * singlePoems.length)];
      case "married":
        return marriedPoems[Math.floor(Math.random() * marriedPoems.length)];
      default:
        return "";
    }
  };


  const generateShareStatus = () => {
    let statusText = "";
    const appLink = "https://valentines-cert.vercel.app/"; // Replace with your actual app link
    if (status === "committed") {
      statusText = `I'm celebrating Valentine's Day with love, committed to ${partnerName} for ${calculateDays(commitmentDate ? new Date(commitmentDate) : null)} days! ❤️ Create your own certificate here: ${appLink}`;
    } else if (status === "single") {
      statusText = "Happy Valentine's Day! I'm proudly single and loving it! 💪 Get your single certificate: ${appLink}";
    } else if (status === "married") {
      statusText = `Celebrating Valentine's Day as happily married to ${partnerName} since ${new Date(marriageDate).toLocaleDateString()}! 💖 Make your certificate: ${appLink}`;
    }
    if (message) {
      statusText += ` My message: "${message}"`;
    }
    return statusText;
  };

  const handleShareStatusClick = () => {
    setShowShareOptions(!showShareOptions);
  };

  const shareToSocialMedia = (platform: string) => {
    const statusText = generateShareStatus();
    const appLink = "https://valentines-cert.vercel.app/"; // Ensure this is consistent
    let shareUrl = "";

    if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appLink)}"e=${encodeURIComponent(statusText)}`;
    } else if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(statusText)}`;
    } else if (platform === "whatsapp") {
      shareUrl = `https://wa.me/?text=${encodeURIComponent(statusText)}`;
    } else if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appLink)}&summary=${encodeURIComponent(statusText)}&title=Valentine's Certificate 2025`;
    }

    window.open(shareUrl, "_blank");
    setShowShareOptions(false);
  };


  const isDownloadEnabled = () => {
    if (!yourName || !status) return false;
    if ((status === 'committed' || status === 'married') && !partnerName) return false;
    if (status === 'committed' && !commitmentDate) return false;
    if (status === 'married' && !marriageDate) return false;
    return true;
  };


  return (
    <div className="min-h-screen bg-[#e8219f] p-6 relative overflow-hidden text-white flex justify-center items-center">
      <FloatingEmojis />
      <FloatingElements />

      <div className="animate-float float-1 bg-hearts absolute top-10 left-10" style={{ width: '60px', height: '60px' }} />
      <div className="animate-float float-2 bg-roses absolute top-20 right-20" style={{ width: '60px', height: '60px' }} />
      <div className="animate-float float-1 bg-chocolates absolute bottom-10 left-20" style={{ width: '60px', height: '60px' }} />
      <div className="animate-float float-2 bg-love absolute bottom-20 right-10" style={{ width: '60px', height: '60px' }} />

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none background-elements">
        <div className="floating-heart" style={{ left: '10%', animationDuration: '5s' }}></div>
        <div className="floating-heart" style={{ left: '25%', animationDuration: '6s' }}></div>
        <div className="floating-heart" style={{ left: '40%', animationDuration: '7s' }}></div>
        <div className="floating-heart" style={{ left: '55%', animationDuration: '5.5s' }}></div>
        <div className="floating-heart" style={{ left: '70%', animationDuration: '6.2s' }}></div>
        <div className="floating-heart" style={{ left: '85%', animationDuration: '5.8s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10 main-content">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold neon-text animate-slide-up"> {/* Responsive font size */}
            Valentine's Week Certificate 2025
          </h1>
          <p className="text-love-200 animate-slide-up delay-100">
            Create your personalized love certificate for Valentine's Day 2025
          </p>
        </div>

        {/* Valentine's Day 2025 Content Above Status */}
        <div className="text-center mb-8 animate-slide-up delay-200">
          <h2 className="text-xl md:text-2xl font-semibold neon-text mb-2"> {/* Responsive font size */}
            Celebrate Love in 2025!
          </h2>
          <p className="text-love-100">
            Design a unique certificate to share your Valentine's sentiment. Whether you're committed, single, or married, express yourself this Valentine's Day!
          </p>
        </div>


        <Card className="glass-card hover:scale-105 transition-transform duration-300">
          <CardHeader>
            <CardTitle className="text-love-50">Choose Your Status</CardTitle>
            <CardDescription className="text-love-100">Select what best describes you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 sm:flex sm:gap-4"> {/* Responsive button layout */}
              <Button
                variant={status === "committed" ? "default" : "glass"}
                className="flex-1 hover:scale-105 transition-transform btn-glass"
                onClick={() => handleStatusChange("committed")}
              >
                Committed
              </Button>
              <Button
                variant={status === "single" ? "default" : "glass"}
                className="flex-1 hover:scale-105 transition-transform btn-glass"
                onClick={() => handleStatusChange("single")}
              >
                Single
              </Button>
              <Button
                variant={status === "married" ? "default" : "glass"}
                className="flex-1 hover:scale-105 transition-transform btn-glass"
                onClick={() => handleStatusChange("married")}
              >
                Married
              </Button>
            </div>

            {status && (
              <div className="space-y-4 animate-slide-up">
                <div>
                  <Label className="form-label">Your Name</Label>
                  <Input
                    placeholder="Enter your name"
                    value={yourName}
                    onChange={(e) => setYourName(e.target.value)}
                    className="form-control hover:border-love-400 transition-colors w-full" // Full width input
                  />
                </div>

                {(status === "committed" || status === "married") && (
                  <>
                    <div>
                      <Label className="form-label">Partner's Name</Label>
                      <Input
                        placeholder="Enter partner's name"
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        className="form-control hover:border-love-400 transition-colors w-full" // Full width input
                      />
                    </div>
                  </>
                )}
                {status === "committed" && (
                  <div>
                    <Label className="form-label">Commitment Date</Label>
                    <Input
                      type="date"
                      value={commitmentDate}
                      onChange={(e) => setCommitmentDate(e.target.value)}
                      className="form-control hover:border-love-400 transition-colors w-full" // Full width input
                    />
                  </div>
                )}

                {status === "married" && (
                  <div>
                    <Label className="form-label">Marriage Date</Label>
                    <Input
                      type="date"
                      value={marriageDate}
                      onChange={(e) => setMarriageDate(e.target.value)}
                      className="form-control hover:border-love-400 transition-colors w-full" // Full width input
                    />
                  </div>
                )}


                <div className="space-y-2">
                  <Label className="form-label">Choose a Quote (Optional)</Label>
                  <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-1"> {/* Responsive quote buttons */}
                    {getQuotesByStatus().map((quote, index) => (
                      <Button
                        key={index}
                        variant="glass"
                        className="text-left hover:bg-love-50 transition-colors btn-glass quote-button" // Added class quote-button
                        onClick={() => handleQuoteSelect(quote)}
                      >
                        {quote}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="form-label">Your Message</Label>
                  <Textarea
                    placeholder="Write your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="h-24 form-control hover:border-love-400 transition-colors w-full" // Full width textarea
                  />
                </div>
                 <p className="text-sm text-love-100 mt-2 italic text-center">
                    To download the certificate, a minimal payment of ₹10 is required. This helps support the app and prevent misuse. Thank you for your understanding!
                 </p>
                 <Button
                    onClick={handleDownload}
                    className="bg-love-600 hover:bg-love-700 hover:scale-105 transition-all btn-glass w-full mt-2"
                    variant="glass"
                    disabled={!isDownloadEnabled()}
                  >
                    Download Certificate (₹10)
                  </Button>
              </div>
            )}
          </CardContent>
        </Card>


      <div className="text-center mt-8 supporting-section">
        <div className="bg-white/10 p-4 rounded-lg shadow-md backdrop-blur-lg inline-block">
          <img src="/QR.png" alt="Support QR Code" className="w-24 h-24 rounded-lg mb-4" />
        </div>

        <p className="text-lg text-love-200 font-semibold mt-4">
          💖 Love this certificate creator? Let’s spread more love together! ❤️
        </p>

        <p className="text-sm text-love-100 mt-2">
          This is our **first-ever community project**, and we’re beyond excited to share it with you! If you’re looking for a **unique way to surprise your partner or someone special**, this is your chance to make the moment unforgettable! 🎁✨
        </p>

        <p className="text-sm text-love-100 mt-4">
          **By supporting us, you help create even more fun, lovable, and heartwarming experiences for everyone.** Your contributions make a difference and fuel our passion to build creative projects like this!
        </p>

        <p className="text-sm text-love-100 mt-4 font-semibold">
          **How can you support?**
        </p>

        <ul className="text-sm text-love-100 list-disc list-inside mt-2">
          <li>💝 **Feeling the love?** Donate by scanning the QR code above!</li>
          <li>🎉 **Surprise your partner** with a beautifully designed custom certificate!</li>
          <li>💌 **Share this page** with friends who would love a special Valentine’s gift.</li>
          <li>✨ **Follow our journey** as we create more exciting projects!</li>
          <li>🌎 **Be part of something bigger!** Your contribution helps us spread love worldwide.</li>
        </ul>

        <p className="text-sm text-love-100 mt-4">
          **Every little support means the world to us!** Let’s continue to make magic together. 💕
        </p>
        <p className="text-sm text-love-100 mt-4 font-semibold">
            🙏 Please don't misuse this app. It's made with love for Valentine's Day. ❤️
        </p>
      </div>


        {status && (
          <div className="flex justify-center gap-4 animate-slide-up delay-400 mt-8 flex-wrap"> {/* Responsive share buttons */}


             <div className="flex gap-2 flex-wrap justify-center"> {/* Wrapped buttons for smaller screens */}
                <Button variant="glass" className="btn-glass hover:bg-love-50 rounded-md flex items-center gap-2 mb-2" onClick={() => shareToSocialMedia('facebook')}> {/* Added mb-2 for spacing */}
                  <FaFacebook /> Facebook
                </Button>
                <Button variant="glass" className="btn-glass hover:bg-love-50 rounded-md flex items-center gap-2 mb-2" onClick={() => shareToSocialMedia('twitter')}> {/* Added mb-2 for spacing */}
                  <FaTwitter /> Twitter
                </Button>
                <Button variant="glass" className="btn-glass hover:bg-love-50 rounded-md flex items-center gap-2 mb-2" onClick={() => shareToSocialMedia('whatsapp')}> {/* Added mb-2 for spacing */}
                  <FaWhatsapp /> WhatsApp
                </Button>
                <Button variant="glass" className="btn-glass hover:bg-love-50 rounded-md flex items-center gap-2 mb-2" onClick={() => shareToSocialMedia('linkedin')}> {/* Added mb-2 for spacing */}
                  <FaLinkedin /> LinkedIn
                </Button>
              </div>
          </div>
        )}
      </div>

      <style jsx global>{`
         body {
            overflow-x: hidden;
         }
        .background-elements {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            overflow: hidden;
        }

        .floating-heart {
            position: absolute;
            width: 50px;
            height: 50px;
            background: rgba(255, 117, 140, 0.1);
            animation: float 20s infinite linear;
            backdrop-filter: blur(5px);
            border-radius: 50%;
        }


        @keyframes floatAnimation {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.8;
            }
            90% {
                opacity: 0.5;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }

        @keyframes float {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.3;
            }
            90% {
                opacity: 0.2;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }

        @keyframes emoji-float {
            0% {
                transform: translateY(100vh) translateX(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.8;
            }
            50% {
                transform: translateY(50vh) translateX(-20px) rotate(180deg);
            }
            90% {
                opacity: 0.5;
            }
            100% {
                transform: translateY(-100vh) translateX(40px) rotate(360deg);
                opacity: 0;
            }
        }


        .animate-emoji-float {
            animation: emoji-float 15s infinite linear;
        }

        .floating-emoji {
            position: absolute;
            bottom: 0;
            pointer-events: none;
            z-index: 0;
            color: white;
        }


        .main-content {
            position: relative;
            z-index: 1;
            padding: 1.5rem; /* Reduced padding for better responsiveness */
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center; /* Center content horizontally */
        }

        .glass-card {
            background: #990061;
            backdrop-filter: blur(10px);
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 1.5rem; /* Reduced padding for better responsiveness */
            margin-bottom: 1.5rem; /* Reduced margin for better responsiveness */
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            width: 100%; /* Make card responsive */
            max-width: 600px; /* Limit card width if needed */
        }

        .glass-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(255, 117, 140, 0.2);
        }

        .card > .card-content {
            padding: 1.5rem; /* Ensure card content padding is also responsive */
        }


        .form-control, .form-select {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
            backdrop-filter: blur(5px);
        }

        .form-control:focus, .form-select:focus {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 117, 140, 0.5);
            color: #fff;
            box-shadow: 0 0 0 0.25rem rgba(255, 117, 140, 0.25);
        }

        .btn-glass {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
            backdrop-filter: blur(5px);
            transition: all 0.3s ease;
        }

        .btn-glass:hover {
            background: rgba(255, 117, 140, 0.2);
            border-color: rgba(255, 117, 140, 0.3);
            color: #fff;
            transform: translateY(-2px);
        }

         .btn-glass.default {
            background: rgba(255, 255, 255, 0.3);
         }

        .certificate-preview {
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 15px;
            padding: 1.5rem;
            color: #fff;
            backdrop-filter: blur(10px);
            position: relative;
            display: none;
        }

        .certificate-border {
            border: 5px solid rgba(255, 117, 140, 0.8);
            padding: 0.8rem;
            background-color: #fef0f9;
            width: 90%; /* Responsive certificate width */
            max-width: 500px; /* Maximum certificate width */
            margin-left: auto;
            margin-right: auto;
        }

        .certificate-bg-love {
             background-color: #fef0f9;
        }


        .neon-text {
            color: #fff;
            text-shadow: 0 0 10px rgba(255, 117, 140, 0.8),
                         0 0 20px rgba(255, 117, 140, 0.8),
                         0 0 30px rgba(255, 117, 140, 0.8);
        }

        h1.neon-text {
            font-size: 2rem; /* Adjusted base font size */
        }

        h2.neon-text {
            font-size: 1.7rem; /* Adjusted base font size */
        }

        h3.neon-text {
            font-size: 1.3rem; /* Adjusted base font size */
        }

        .certificate-image {
            max-width: 80%; /* Responsive image size */
            height: auto;
            display: block; /* Prevent extra space below image */
            margin-left: auto;
            margin-right: auto;
        }


        ::placeholder {
            color: rgba(255, 255, 255, 0.5);
        }

        .form-label {
            color: rgba(255, 255, 255, 0.8);
        }

        .status-text {
            font-size: 1.2rem;
            color: #fff;
            margin-bottom: 1rem;
        }

        .supporting-section {
            text-align: center;
            margin-top: 1.5rem; /* Reduced margin for better responsiveness */
            padding: 1rem;
        }

        .sticker {
            position: absolute;
            font-size: 1.2em; /* Adjusted sticker base size */
            opacity: 0.8;
            pointer-events: none;
        }

        .sticker-heart {
            font-size: 2em;
        }

        .sticker-rose {
            font-size: 1.8em;
        }

        .sticker-sparkle {
            font-size: 1.2em;
        }

        .poem-section {
            margin-top: 1rem;
            font-size: 0.8rem; /* Adjusted poem font size */
            white-space: pre-line;
        }

        .website-link {

        }

        /* Added style for quote buttons to enable text wrapping */
        .quote-button {
            white-space: normal;
            word-wrap: break-word;
            text-align: left; /* Keep text left-aligned within the button */
        }


        /* Media Queries for Responsiveness */
        @media (min-width: 768px) { /* Tablets and larger */
            h1.neon-text {
                font-size: 2.5rem; /* Larger font size for tablets and desktops */
            }
            h2.neon-text {
                font-size: 2rem; /* Larger font size for tablets and desktops */
            }
            h3.neon-text {
                font-size: 1.5rem; /* Larger font size for tablets and desktops */
            }
            .glass-card {
                padding: 2rem; /* Larger padding for tablets and desktops */
                margin-bottom: 2rem; /* Larger margin for tablets and desktops */
            }
            .card > .card-content {
                 padding: 2rem; /* Larger card content padding for tablets and desktops */
            }
            .sticker {
                font-size: 1.5em; /* Larger sticker size for tablets and desktops */
            }
            .sticker-heart {
                font-size: 2.5em;
            }

            .sticker-rose {
                font-size: 2em;
            }

            .sticker-sparkle {
                font-size: 1.5em;
            }
            .poem-section {
                font-size: 0.9rem; /* Larger poem font size for tablets and desktops */
            }
        }


      `}</style>
    </div>
  );
}
