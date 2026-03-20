import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Copy, Share2, MessageCircle, Mail } from 'lucide-react';
import useStore from '../../store/useStore';
import './WizardSteps.css';

export default function Step6Success() {
  const navigate = useNavigate();
  const createdId = useStore(s => s.wizardCreatedId);
  const [copied, setCopied] = useState(false);

  const shareUrl = createdId
    ? `${window.location.origin}/view/${createdId}`
    : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGoDashboard = () => {
    resetWizard();
    navigate('/dashboard');
  };

  const handleShare = (platform) => {
    const text = `I sent you a HeartScript! 💌 Open it here:`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(text);

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodedText}%20${encodedUrl}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=You have a HeartScript!&body=${encodedText}%20${encodedUrl}`, '_blank');
        break;
      case 'sms':
        window.open(`sms:?body=${encodedText}%20${encodedUrl}`, '_blank');
        break;
      default:
        if (navigator.share) {
          navigator.share({ title: 'HeartScript', text, url: shareUrl });
        }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="success-page"
    >
      <div className="success-icon">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
          className="success-check"
        >
          <Check size={40} />
        </motion.div>
      </div>

      <div className="success-badge">
        <span className="badge badge-live"><span className="badge-dot" /> Completed</span>
      </div>

      <h1 className="success-title">Your HeartScript<br />is ready!</h1>
      <p className="success-desc">Share it with the one who deserves your words.</p>

      {/* Link */}
      <div className="success-link-box">
        <span className="success-link truncate">{shareUrl}</span>
        <button className="success-copy-btn" onClick={handleCopy}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>

      {/* Share buttons */}
      <div className="success-share-row">
        <button className="success-share-btn whatsapp" onClick={() => handleShare('whatsapp')}>
          <MessageCircle size={20} />
          <span>WhatsApp</span>
        </button>
        <button className="success-share-btn sms" onClick={() => handleShare('sms')}>
          <MessageCircle size={20} />
          <span>Message</span>
        </button>
        <button className="success-share-btn email" onClick={() => handleShare('email')}>
          <Mail size={20} />
          <span>Email</span>
        </button>
        <button className="success-share-btn share" onClick={() => handleShare('share')}>
          <Share2 size={20} />
          <span>Share</span>
        </button>
      </div>

      {/* Go to dashboard */}
      <button className="btn-primary success-dash-btn" onClick={handleGoDashboard}>
        Go to Dashboard
      </button>
    </motion.div>
  );
}
