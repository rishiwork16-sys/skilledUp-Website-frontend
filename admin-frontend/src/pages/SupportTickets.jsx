import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import supportService from '../services/support.service';
import { MessageSquare, Send, CheckCircle, User, Shield } from 'lucide-react';

const SupportTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [reply, setReply] = useState('');
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [filter, setFilter] = useState('ALL');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        loadTickets();
    }, [filter]);

    useEffect(() => {
        if (selectedTicket) {
            loadChatHistory(selectedTicket.id);
        }
    }, [selectedTicket]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const loadTickets = async () => {
        try {
            setLoading(true);
            const data = filter === 'OPEN'
                ? await supportService.getOpenTickets()
                : await supportService.getAllTickets();
            setTickets(data);
        } catch (error) {
            console.error("Failed to load tickets", error);
        } finally {
            setLoading(false);
        }
    };

    const loadChatHistory = async (ticketId) => {
        try {
            setMessagesLoading(true);
            const history = await supportService.getChatHistory(ticketId);
            setMessages(history);
        } catch (error) {
            console.error("Failed to load chat history", error);
        } finally {
            setMessagesLoading(false);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!reply.trim()) return;

        try {
            // Optimistic update
            const newMessage = {
                id: Date.now(),
                ticketId: selectedTicket.id,
                senderId: "ADMIN",
                content: reply,
                timestamp: new Date().toISOString(),
                admin: true
            };
            setMessages([...messages, newMessage]);
            setReply('');

            await supportService.replyToTicket(selectedTicket.id, reply);
            loadChatHistory(selectedTicket.id); // Refresh to get real ID
        } catch (error) {
            console.error("Failed to send reply", error);
            alert('Failed to send reply');
        }
    };

    const handleClose = async (ticketId) => {
        if (window.confirm('Are you sure you want to close this ticket?')) {
            try {
                await supportService.closeTicket(ticketId);
                alert('Ticket closed successfully!');
                loadTickets();
                if (selectedTicket?.id === ticketId) {
                    setSelectedTicket(prev => ({ ...prev, status: 'CLOSED' }));
                }
            } catch (error) {
                alert('Failed to close ticket');
            }
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            'OPEN': 'bg-amber-100 text-amber-700 border-amber-200',
            'IN_REVIEW': 'bg-blue-100 text-blue-700 border-blue-200',
            'RESOLVED': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'CLOSED': 'bg-slate-100 text-slate-600 border-slate-200'
        };
        const activeStyle = styles[status] || styles['CLOSED'];

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${activeStyle} flex items-center gap-1.5`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
                {status}
            </span>
        );
    };

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-100px)] flex flex-col bg-slate-50/50">
                {/* Header Section */}
                <div className="flex justify-between items-end mb-6 px-1">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Support Console</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage student inquiries and support requests</p>
                    </div>

                    <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex gap-1">
                        {['ALL', 'OPEN'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filter === type
                                    ? 'bg-slate-900 text-white shadow-md transform scale-105'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                {type === 'ALL' ? 'All Tickets' : 'Open Only'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
                    {/* Tickets List */}
                    <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50 backdrop-blur">
                            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ticket Queue</h2>
                        </div>

                        <div className="overflow-y-auto flex-1 p-3 space-y-2 custom-scrollbar">
                            {loading ? (
                                <div className="space-y-3 p-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-xl"></div>
                                    ))}
                                </div>
                            ) : tickets.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                        <MessageSquare size={20} className="opacity-50" />
                                    </div>
                                    <p className="text-sm font-medium">No tickets found</p>
                                </div>
                            ) : (
                                tickets.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        onClick={() => setSelectedTicket(ticket)}
                                        className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 border ${selectedTicket?.id === ticket.id
                                            ? 'bg-blue-50/80 border-blue-200 shadow-sm ring-1 ring-blue-100'
                                            : 'bg-white border-transparent hover:border-slate-200 hover:shadow-md hover:-translate-y-0.5'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono text-slate-400">#{ticket.id}</span>
                                                {getStatusBadge(ticket.status)}
                                            </div>
                                            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                                                {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>

                                        <h3 className={`font-semibold text-sm mb-1 line-clamp-1 ${selectedTicket?.id === ticket.id ? 'text-blue-900' : 'text-slate-800'
                                            }`}>
                                            {ticket.subject}
                                        </h3>
                                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                            {ticket.description}
                                        </p>

                                        {/* Hover Indicator */}
                                        <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full transition-all duration-200 ${selectedTicket?.id === ticket.id ? 'bg-blue-500' : 'bg-transparent group-hover:bg-slate-200'
                                            }`}></div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="lg:col-span-8 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden flex flex-col relative">
                        {selectedTicket ? (
                            <>
                                {/* Chat Header */}
                                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur sticky top-0 z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h2 className="text-lg font-bold text-slate-900">{selectedTicket.subject}</h2>
                                                {getStatusBadge(selectedTicket.status)}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                                    Ticket #{selectedTicket.id}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                                    Student ID: {selectedTicket.studentId}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedTicket.status !== 'CLOSED' && (
                                        <button
                                            onClick={() => handleClose(selectedTicket.id)}
                                            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 border border-slate-200 transition-all duration-200"
                                        >
                                            <CheckCircle size={16} className="group-hover:scale-110 transition-transform" />
                                            <span className="font-medium text-sm">Resolve Ticket</span>
                                        </button>
                                    )}
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/30 custom-scrollbar">
                                    {/* Original Context Card */}
                                    <div className="flex justify-center mb-8">
                                        <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm max-w-2xl w-full relative overflow-hidden group">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 group-hover:bg-indigo-500 transition-colors"></div>
                                            <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                                                <MessageSquare size={12} />
                                                Original Request
                                            </div>
                                            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                                                {selectedTicket.description}
                                            </p>
                                            <div className="mt-3 text-[10px] text-slate-400 text-right">
                                                {new Date(selectedTicket.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    {messagesLoading ? (
                                        <div className="flex justify-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                        </div>
                                    ) : (
                                        messages.map((msg) => (
                                            <div key={msg.id} className={`flex w-full ${msg.admin ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`flex max-w-[75%] gap-3 ${msg.admin ? 'flex-row-reverse' : 'flex-row'}`}>
                                                    {/* Avatar */}
                                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] shadow-sm mt-auto border ${msg.admin
                                                        ? 'bg-indigo-600 text-white border-indigo-500'
                                                        : 'bg-white text-slate-600 border-slate-100'
                                                        }`}>
                                                        {msg.admin ? <Shield size={14} /> : <User size={14} />}
                                                    </div>

                                                    {/* Message Bubble */}
                                                    <div className={`group relative p-4 shadow-sm transition-all hover:shadow-md ${msg.admin
                                                        ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-2xl rounded-tr-sm'
                                                        : 'bg-white border border-slate-100 text-slate-700 rounded-2xl rounded-tl-sm'
                                                        }`}>
                                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                                        <span className={`text-[9px] font-medium absolute -bottom-5 w-max opacity-0 group-hover:opacity-100 transition-opacity ${msg.admin ? 'right-0 text-slate-400' : 'left-0 text-slate-400'
                                                            }`}>
                                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Reply Area */}
                                {selectedTicket.status !== 'CLOSED' && (
                                    <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] z-20">
                                        <form onSubmit={handleReply} className="flex gap-3 items-end max-w-4xl mx-auto w-full">
                                            <div className="flex-1 relative">
                                                <textarea
                                                    value={reply}
                                                    onChange={(e) => setReply(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            e.preventDefault();
                                                            handleReply(e);
                                                        }
                                                    }}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-5 pr-4 py-3.5 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all resize-none text-sm min-h-[50px] max-h-32 custom-scrollbar shadow-inner"
                                                    placeholder="Type your reply... (Enter to send)"
                                                    rows={1}
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={!reply.trim()}
                                                className="bg-slate-900 text-white p-3.5 rounded-xl hover:bg-slate-800 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-lg shadow-slate-200"
                                            >
                                                <Send size={20} className={reply.trim() ? 'translate-x-0.5 translate-y-px' : ''} />
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-slate-50/30">
                                <div className="w-24 h-24 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-center mb-6 animate-pulse">
                                    <MessageSquare size={40} className="text-slate-200" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-700 mb-2">Select a Ticket</h3>
                                <p className="text-slate-500 text-sm max-w-xs text-center leading-relaxed">
                                    Choose a ticket from the queue to view details, chat history, and respond to students.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SupportTickets;
