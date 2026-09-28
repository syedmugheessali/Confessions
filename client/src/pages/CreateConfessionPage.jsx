import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createConfession } from '../services/confessionApi';

const RANDOM_CONFESSIONS = [
  "Subhan bhai told us 'bas 5 minute mein pohanch raha hoon' exactly 2 hours ago. Still waiting at the cafe.",
  "I borrowed Subhan bhai's car last week and returned it with 0km range on reserve fuel. Sorry Subhan bhai.",
  "Subhan bhai gives 45-minute motivational lectures on waking up at 5 AM, but woke up at 3:30 PM today.",
  "Whenever the restaurant bill arrives, Muddi bhai suddenly receives an 'urgent phone call' and vanishes for 20 minutes.",
  "Muddi bhai has sworn to start his serious gym routine 'next Monday' every single week since 2021.",
  "Muddi bhai will argue over a 50 rupee delivery fee, but drop 15k on custom mechanical keyboard switches without blinking.",
  "Muddi bhai borrowed my black hoodie 3 months ago and now posts pictures wearing it like it's his own.",
  "Shayan spent the entire night crying he was going to fail the exam, only to top the class with the highest score.",
  "Shayan spent 6 hours debugging code only to realize he was running a completely different project in terminal.",
  "Shayan currently has 19 unfinished side projects on GitHub, all titled 'next-big-thing-final-v2'.",
  "Amusha has certified gossip and breaking news on everyone before it even happens in reality. CIA needs to hire her.",
  "Amusha spends 40 minutes analyzing the entire menu, orders plain fries, and then eats half of everyone else's food.",
  "If you tell Amusha 'kisi ko mat batana', just know that her definition of 'kisi' excludes her 4 favorite group chats.",
  "Can someone stage an intervention for Muddi bhai and Subhan bhai? They have been debating Python vs JavaScript for 4 years.",
  "I secretly switched the dhaba chai to decaf and watched Subhan bhai, Muddi bhai, and Shayan pretend it gave them superhuman coding power."
];

const CreateConfessionPage = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Pick a random placeholder on component mount
  const placeholderPrompt = useMemo(() => {
    const randomItem = RANDOM_CONFESSIONS[Math.floor(Math.random() * RANDOM_CONFESSIONS.length)];
    return `What's on your mind? (e.g. "${randomItem}")`;
  }, []);

  const handleInsertRandom = () => {
    const randomItem = RANDOM_CONFESSIONS[Math.floor(Math.random() * RANDOM_CONFESSIONS.length)];
    setContent(randomItem);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Confession cannot be empty.');
      return;
    }
    if (content.length > 1000) {
      setError('Confession is too long (maximum 1000 characters).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createConfession(content);
      navigate('/confessions');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create confession');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container create-page">
      <div className="create-card card-layout">
        <h2>New Confession</h2>
        <p className="subtitle-text">Write your note. It will be posted anonymously.</p>
        
        {error && <div className="form-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="random-prompt-bar">
            <button 
              type="button" 
              className="btn-random-prompt"
              onClick={handleInsertRandom}
              title="Fill with a random placeholder confession"
            >
              🎲 Insert random confession idea
            </button>
          </div>

          <div className="form-group">
            <textarea
              className="confession-textarea"
              placeholder={placeholderPrompt}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="6"
              maxLength={1000}
            />
            <div className="char-count">
              {content.length} / 1000
            </div>
          </div>

          <button type="submit" className="btn-primary full-width" disabled={loading || !content.trim()}>
            {loading ? 'Publishing...' : 'Publish confession'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateConfessionPage;
