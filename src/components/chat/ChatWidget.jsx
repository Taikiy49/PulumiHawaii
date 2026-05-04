import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Sparkles, CheckCircle2, Calendar, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ReactMarkdown from 'react-markdown';
import ChatPromoPopup from './ChatPromoPopup';
import ChatQuickActions from './ChatQuickActions';

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: "Aloha! 🌺 I'm Pulumi, your personal assistant. I can tell you about our cleaning services, answer questions, or even book a service for you right here!\n\nご質問やご予約はお気軽にどうぞ。日本語でも対応しております！\n\nHow can I help you today?",
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch available dates on mount
  useEffect(() => {
    if (isOpen && availableDates.length === 0) {
      base44.entities.Availability.list()
        .then(data => {
          const dates = [...new Set(data
            .filter(a => a.is_available && new Date(a.date) >= new Date())
            .map(a => a.date)
          )].sort();
          setAvailableDates(dates);
        });
    }
  }, [isOpen, availableDates.length]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async (text = null) => {
    const messageText = (text || input).trim();
    if (!messageText || isLoading) return;

    setShowQuickActions(false);
    const userMessage = { role: 'user', content: messageText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await base44.functions.invoke('pulumiChat', {
        messages: updatedMessages.filter(m => m.role !== 'system'),
      });

      const { message, bookingCreated } = response.data;
      setMessages(prev => [...prev, { role: 'assistant', content: message }]);
      if (bookingCreated) setBookingConfirmed(true);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble right now. Please call us at (808) 227-7729 or email pulumihawaii@gmail.com 🌺",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    const actionMessages = {
      book: "I'd like to book a service",
      pricing: "Can you tell me about your pricing?",
      contact: "How can I contact Pulumi Hawaii?",
    };
    sendMessage(actionMessages[action]);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // Fetch times for this date
    base44.entities.Availability.list()
      .then(data => {
        const times = data.find(a => a.date === date)?.time_slots || [];
        setAvailableTimes(times);
        setSelectedTime('');
      });
    sendMessage(date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    sendMessage(time);
  };

  // Detect if bot is asking for date/time from the last message
  const lastMessage = messages[messages.length - 1]?.content || '';
  const isAskingForDate = lastMessage.toLowerCase().includes('date') && selectedDate === '';
  const isAskingForTime = lastMessage.toLowerCase().includes('time') && selectedDate !== '' && selectedTime === '';

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {!isOpen && <ChatPromoPopup onOpen={() => setIsOpen(true)} />}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[340px] sm:w-[380px] bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: '520px' }}
          >
            {/* Header */}
            <div className="bg-primary px-5 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-white">Pulumi Assistant</p>
                  <p className="font-body text-xs text-white/70">Online · Typically replies instantly</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && showQuickActions && (
              <ChatQuickActions
                onSelectService={(service) => sendMessage(`I'm interested in ${service}`)}
                onSelectAction={handleQuickAction}
                isVisible={true}
              />
            )}

            {/* Date Picker */}
            {isAskingForDate && availableDates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3"
              >
                <p className="text-xs font-body text-muted-foreground mb-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Select a Date
                </p>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {availableDates.map(date => (
                    <motion.button
                      key={date}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleDateSelect(date)}
                      className="px-3 py-2 rounded-lg bg-primary/5 hover:bg-primary/15 border border-primary/20 hover:border-primary/40 transition-colors text-xs font-body text-foreground"
                    >
                      {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Time Picker */}
            {isAskingForTime && availableTimes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3"
              >
                <p className="text-xs font-body text-muted-foreground mb-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Select a Time
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map(time => (
                    <motion.button
                      key={time}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleTimeSelect(time)}
                      className="px-3 py-2 rounded-lg bg-primary/5 hover:bg-primary/15 border border-primary/20 hover:border-primary/40 transition-colors text-xs font-body text-foreground"
                    >
                      {time}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-body leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown
                        className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p]:my-0.5"
                        components={{
                          p: ({ children }) => <p className="my-0.5">{children}</p>,
                          ul: ({ children }) => <ul className="my-1 ml-3 list-disc">{children}</ul>,
                          li: ({ children }) => <li className="my-0">{children}</li>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {bookingConfirmed && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <p className="font-body text-xs text-green-700">Booking request submitted! We'll confirm shortly.</p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border bg-card flex-shrink-0">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  rows={1}
                  className="flex-1 resize-none rounded-2xl border border-input bg-background px-4 py-2.5 text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring max-h-24"
                  style={{ height: 'auto' }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
                  }}
                />
                <button
                   onClick={() => sendMessage()}
                   disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(prev => !prev)}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}