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

type Status = "committed" | "single" | "other";

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

const otherQuotes = [
  "The best love stories are the ones we dare to dream 💭",
  "Sometimes the best things in life take time ⏳",
  "Love is patient, love is kind 💝",
  "Hope is the heartbeat of love 💗",
  "Every great love story starts with a first step 🌹",
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
  const [otherDescription, setOtherDescription] = useState("");
  const [message, setMessage] = useState("");
  const [commitmentDate, setCommitmentDate] = useState("");
  const [selectedQuote, setSelectedQuote] = useState("");
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleStatusChange = (newStatus: Status) => {
    setStatus(newStatus);
    setMessage("");
    setSelectedQuote("");
    if (newStatus !== "committed") {
      setPartnerName("");
      setCommitmentDate("");
    }
  };

  const calculateDays = () => {
    if (!commitmentDate) return null;
    const start = new Date(commitmentDate);
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
    const certificateElement = document.getElementById("certificate");

    if (certificateElement) {
      try {
        const canvas = await html2canvas(certificateElement, {
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
      case "other":
        return otherQuotes;
      default:
        return [];
    }
  };

  const generateShareStatus = () => {
    let statusText = "";
    const appLink = "[Your App Link Here]"; // Replace with your actual app link
    if (status === "committed") {
      statusText = `I'm celebrating Valentine's Day with love, committed to ${partnerName} for ${calculateDays()} days! ❤️ Create your own certificate here: ${appLink}`;
    } else if (status === "single") {
      statusText = "Happy Valentine's Day! I'm proudly single and loving it! 💪 Get your single certificate: ${appLink}";
    } else if (status === "other") {
      statusText = `It's Valentine's Day and I'm feeling the love in my ${otherDescription} journey! 💖 Make your certificate: ${appLink}`;
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
    const appLink = "[Your App Link Here]"; // Ensure this is consistent
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


  return (
    <div className="min-h-screen bg-[#e8219f] p-6 relative overflow-hidden text-white">
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
          <h1 className="text-4xl font-bold neon-text animate-slide-up">
            Valentine's Week Certificate 2025
          </h1>
          <p className="text-love-200 animate-slide-up delay-100">
            Create your personalized love certificate for Valentine's Day 2025
          </p>
        </div>

        {/* Valentine's Day 2025 Content Above Status */}
        <div className="text-center mb-8 animate-slide-up delay-200">
          <h2 className="text-2xl font-semibold neon-text mb-2">
            Celebrate Love in 2025!
          </h2>
          <p className="text-love-100">
            Design a unique certificate to share your Valentine's sentiment. Whether you're committed, single, or somewhere in between, express yourself this Valentine's Day!
          </p>
        </div>


        <Card className="glass-card hover:scale-105 transition-transform duration-300">
          <CardHeader>
            <CardTitle className="text-love-50">Choose Your Status</CardTitle>
            <CardDescription className="text-love-100">Select what best describes you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
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
                variant={status === "other" ? "default" : "glass"}
                className="flex-1 hover:scale-105 transition-transform btn-glass"
                onClick={() => handleStatusChange("other")}
              >
                Other
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
                    className="form-control hover:border-love-400 transition-colors"
                  />
                </div>

                {status === "committed" && (
                  <>
                    <div>
                      <Label className="form-label">Partner's Name</Label>
                      <Input
                        placeholder="Enter partner's name"
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        className="form-control hover:border-love-400 transition-colors"
                      />
                    </div>
                    <div>
                      <Label className="form-label">Commitment Date</Label>
                      <Input
                        type="date"
                        value={commitmentDate}
                        onChange={(e) => setCommitmentDate(e.target.value)}
                        className="form-control hover:border-love-400 transition-colors"
                      />
                    </div>
                  </>
                )}

                {status === "other" && (
                  <div>
                    <Label className="form-label">Describe Your Relationship</Label>
                    <Input
                      placeholder="One-sided love, Crush, etc."
                      value={otherDescription}
                      onChange={(e) => setOtherDescription(e.target.value)}
                      className="form-control hover:border-love-400 transition-colors"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="form-label">Choose a Quote (Optional)</Label>
                  <div className="grid gap-2">
                    {getQuotesByStatus().map((quote, index) => (
                      <Button
                        key={index}
                        variant="glass"
                        className="text-left hover:bg-love-50 transition-colors btn-glass"
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
                    className="h-24 form-control hover:border-love-400 transition-colors"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {status && (
          <Card className="glass-card certificate-preview hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <CardTitle className="text-love-50 neon-text">Your Certificate</CardTitle>
            </CardHeader>
            <CardContent>
              <div id="certificate" className="certificate-border certificate-bg-love p-8 text-center space-y-4 relative overflow-hidden">

                {/* Stickers for Certificate */}
                <div className="sticker sticker-heart" style={{ top: '10px', left: '20px' }}>❤️</div>
                <div className="sticker sticker-rose" style={{ bottom: '20px', right: '30px', transform: 'rotate(-15deg)' }}>🌹</div>
                <div className="sticker sticker-sparkle" style={{ top: '50%', right: '10px', transform: 'translateY(-50%) rotate(25deg)' }}>✨</div>


                {status === "committed" && (
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-hearts opacity-20 rotate-12" style={{ width: '80px', height: '80px' }} />
                )}
                {status === "single" && (
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-love opacity-20 rotate-12" style={{ width: '80px', height: '80px' }} />
                )}
                <h2 className="text-3xl font-serif neon-text">
                  Valentine's Day 2025
                </h2>
                <p className="text-lg text-love-800 font-medium">
                  Certificate of Love
                </p>
                <p className="text-love-800">This certifies that</p>
                <h3 className="text-xl font-bold neon-text">
                  {yourName}
                  {status === "committed" && partnerName && ` & ${partnerName}`}
                </h3>
                <p className="text-love-800">
                  {status === "committed" && "are committed to each other"}
                  {status === "single" && "is proudly single"}
                  {status === "other" &&
                    otherDescription &&
                    `is in ${otherDescription}`}
                </p>
                {status === "committed" && commitmentDate && (
                  <>
                    <p className="text-love-700">
                      Since {new Date(commitmentDate).toLocaleDateString()}
                    </p>
                    <p className="text-love-700 font-bold">
                      {calculateDays()} days of love ❤️
                    </p>
                  </>
                )}
                {message && (
                  <p className="italic text-love-700 mt-4">"{message}"</p>
                )}

                {/* QR Code Section */}
                <div className="mt-8 border-t border-love-200 pt-4">
                  <p className="text-sm text-love-700 mb-2">Support Our Love Project</p>
                  <div className="flex justify-center items-center space-x-4">
                    <div className="bg-white/10 p-4 rounded-lg shadow-md backdrop-blur-lg">
                      <img src="/QR.png" alt="QR Code" className="w-24 h-24 rounded-lg" />
                    </div>
                    <div className="text-left text-sm text-love-700">
                      <p>Scan to contribute</p>
                      <p>Share love & support</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      <div className="text-center mt-8 supporting-section">
        <div className="bg-white/10 p-4 rounded-lg shadow-md backdrop-blur-lg inline-block">
          <img src="/QR.png" alt="Support QR Code" className="w-24 h-24 rounded-lg mb-4" />
        </div>

        <p className="text-lg text-love-200 font-semibold mt-4">
          💖 Love this certificate creator? Let’s spread more love together! ❤️
        </p>

        <p className="text-sm text-love-100 mt-2"><strong>
          This is our **first-ever community project**, and we’re beyond excited to share it with you! If you’re looking for a **unique way to surprise your partner or someone special**, this is your chance to make the moment unforgettable! 🎁✨
        </strong>
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
      </div>


        {status && (
          <div className="flex justify-center gap-4 animate-slide-up delay-400 mt-8">
            <Button
              onClick={handleDownload}
              className="bg-love-600 hover:bg-love-700 hover:scale-105 transition-all btn-glass"
              variant="glass"
            >
              Download Certificate
            </Button>
             <Button
              className="bg-love-600 hover:bg-love-700 hover:scale-105 transition-all btn-glass relative"
              variant="glass"
              onClick={handleShareStatusClick}
            >
              Share as Status
            </Button>

            {showShareOptions && (
              <div className="absolute bottom-full left-0 mb-2 bg-white shadow-xl rounded-md p-4 z-10">
                <Button variant="ghost" className="block w-full text-left hover:bg-love-50 rounded-md flex items-center gap-2" onClick={() => shareToSocialMedia('twitter')}>
                  <FaTwitter /> Twitter
                </Button>
                <Button variant="ghost" className="block w-full text-left hover:bg-love-50 rounded-md flex items-center gap-2" onClick={() => shareToSocialMedia('whatsapp')}>
                  <FaWhatsapp /> WhatsApp
                </Button>
                <Button variant="ghost" className="block w-full text-left hover:bg-love-50 rounded-md flex items-center gap-2" onClick={() => shareToSocialMedia('linkedin')}>
                  <FaLinkedin /> LinkedIn
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
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
            padding: 2rem;
        }

        .glass-card {
            background: #990061;
            backdrop-filter: blur(10px);
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 2rem;
            margin: 4rem 0;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .glass-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(255, 117, 140, 0.2);
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
            padding: 2rem;
            color: #fff;
            backdrop-filter: blur(10px);
            position: relative;
        }

        .certificate-border {
            border: 5px solid rgba(255, 117, 140, 0.8);
            padding: 1rem;
            background-color: #fef0f9;
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
            margin-top: 4rem;
            padding: 2rem;
        }

        .sticker {
            position: absolute;
            font-size: 2em; /* Adjust size as needed */
            opacity: 0.8; /* Adjust opacity if needed */
            pointer-events: none; /* Make sure stickers don't interfere with clicks */
        }

        .sticker-heart {
            font-size: 3em;
        }

        .sticker-rose {
            font-size: 2.5em;
        }

        .sticker-sparkle {
            font-size: 2em;
        }


      `}</style>
    </div>
  );
}