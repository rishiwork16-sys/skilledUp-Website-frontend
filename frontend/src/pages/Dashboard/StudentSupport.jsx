import { useState, useEffect, useRef } from 'react';
import supportService from '../../api/supportService';
import { useUser } from '../../context/UserContext';
import { PlusCircle, MessageSquare, Send, X, Clock, CheckCircle, User, Shield, AlertCircle } from 'lucide-react';

const StudentSupport = () => {
    const { user, refreshBackendProfile } = useUser();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [reply, setReply] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [messagesLoading, setMessagesLoading] = useState(false);

    // New Ticket Form
    const [newSubject, setNewSubject] = useState('');
    const [newMessage, setNewMessage] = useState('');

    const messagesEndRef = useRef(null);

    // Force refresh profile on mount to ensure we have latest IDs
    useEffect(() => {
        if (refreshBackendProfile) {
            refreshBackendProfile().then(data => {
                console.log("StudentSupport - Refreshed profile:", data);
            });
        }
    }, []);

    useEffect(() => {
        if (user) {
            loadTickets();
        }
    }, [user]);

    useEffect(() => {
        if (selectedTicket) {
            loadChatHistory(selectedTicket.id);
            // Polling for new messages every 10 seconds
            const interval = setInterval(() => {
                loadChatHistory(selectedTicket.id, true); // silent update
            }, 10000);
            return () => clearInterval(interval);
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
            // Robust extraction
            const studentId = user?.id || user?.userId || user?.studentId || user?.backendData?.id;

            if (!studentId) {
                console.warn("loadTickets - No Student ID found");
                return;
            }

            const data = await supportService.getMyTickets(studentId);
            setTickets(data);
        } catch (error) {
            console.error("Failed to load tickets", error);
        } finally {
            setLoading(false);
        }
    };

    const loadChatHistory = async (ticketId, silent = false) => {
        try {
            if (!silent) setMessagesLoading(true);
            const data = await supportService.getChatHistory(ticketId);
            setMessages(data);
        } catch (error) {
            console.error("Failed to load chat", error);
        } finally {
            if (!silent) setMessagesLoading(false);
        }
    };

    const createTicketWithId = async (id) => {
        try {
            console.log("Creating ticket for Student ID:", id);
            const ticketData = {
                studentId: id,
                subject: newSubject,
                description: newMessage,
                status: 'OPEN'
            };

            await supportService.createTicket(ticketData);
            setShowCreateModal(false);
            setNewSubject('');
            setNewMessage('');
            loadTickets();
            alert("Ticket created successfully!");
        } catch (error) {
            // Better error handling
            let errorMsg = 'Failed to create ticket';

            if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
                errorMsg = 'Backend service is not running. Please start the support-service microservice first.\n\nTo start:\n1. Navigate to support-service folder\n2. Run: mvn spring-boot:run';
            } else if (error.response) {
                errorMsg = error.response.data?.message || `Server error: ${error.response.status}`;
                if (error.response.data?.error) {
                    errorMsg += ` (${error.response.data.error})`;
                }
            } else {
                errorMsg = error.message || 'Unknown error occurred';
            }

            alert(`Error: ${errorMsg}`);
        }
    }

    const handleCreateTicket = async (e) => {
        e.preventDefault();

        // Debug user object
        console.log("Submit Ticket - User Object:", user);

        // Check if backendData is a string and needs parsing
        let backendId = user?.backendData?.id;
        if (!backendId && typeof user?.backendData === 'string') {
            try {
                const parsed = JSON.parse(user.backendData);
                backendId = parsed.id || parsed.userId;
            } catch (e) { console.error("Could not parse backendData", e); }
        }

        // Robust ID extraction
        const studentId = user?.id || user?.userId || user?.studentId || backendId || user?.backendData?.userId;

        if (!studentId) {
            console.error("❌ CRITICAL: Student ID missing in user object", user);

            // Try one last refresh
            const updatedProfile = await refreshBackendProfile();
            const retryId = updatedProfile?.id || updatedProfile?.userId;

            if (retryId) {
                // Retry success!
                console.log("Refreshed and found ID:", retryId);
                createTicketWithId(retryId);
                return;
            }

            alert(`Debug Error: User ID missing.\nUser Keys: ${Object.keys(user || {}).join(', ')}\nBackendData: ${JSON.stringify(user?.backendData || {})}`);
            return;
        }

        createTicketWithId(studentId);
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!reply.trim()) return;

        // Robust ID extraction
        const studentId = user?.id || user?.userId || user?.studentId || user?.backendData?.id;

        if (!studentId) {
            alert("User ID not found. Please refresh the page.");
            return;
        }

        try {
            const messageDto = {
                ticketId: selectedTicket.id,
                senderId: studentId,
                content: reply,
                isAdmin: false
            };

            await supportService.replyToTicketRest(selectedTicket.id, messageDto);
            setReply('');
            loadChatHistory(selectedTicket.id, true);
        } catch (error) {
            console.error(error);
            alert('Failed to send reply');
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
        <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-100px)]">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Support Hub</h1>
                    <p className="text-slate-500 text-sm mt-1">Track your requests and communicate with our team</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 hover:scale-105 active:scale-95 duration-200"
                >
                    <PlusCircle size={18} />
                    <span className="font-semibold text-sm">New Ticket</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100%-80px)]">
                {/* Ticket List */}
                <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 backdrop-blur">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <Clock size={12} />
                            Your History
                        </h2>
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
                                <p className="text-sm font-medium">No tickets yet</p>
                            </div>
                        ) : (
                            tickets.map(ticket => (
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
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
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
                                            Created {new Date(selectedTicket.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/30 custom-scrollbar">
                                {/* Original Context Card */}
                                <div className="flex justify-center mb-8">
                                    <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm max-w-2xl w-full relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 group-hover:bg-indigo-500 transition-colors"></div>
                                        <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                                            <MessageSquare size={12} />
                                            Original Issue
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
                                    messages.map((msg, idx) => (
                                        <div key={idx} className={`flex w-full ${!msg.admin ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`flex max-w-[75%] gap-3 ${!msg.admin ? 'flex-row-reverse' : 'flex-row'}`}>
                                                {/* Avatar */}
                                                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] shadow-sm mt-auto border ${!msg.admin
                                                    ? 'bg-indigo-600 text-white border-indigo-500'
                                                    : 'bg-white text-slate-600 border-slate-100'
                                                    }`}>
                                                    {!msg.admin ? <User size={14} /> : <Shield size={14} />}
                                                </div>

                                                {/* Message Bubble */}
                                                <div className={`group relative p-4 shadow-sm transition-all hover:shadow-md ${!msg.admin
                                                    ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-2xl rounded-tr-sm'
                                                    : 'bg-white border border-slate-100 text-slate-700 rounded-2xl rounded-tl-sm'
                                                    }`}>
                                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                                    <span className={`text-[9px] font-medium absolute -bottom-5 w-max opacity-0 group-hover:opacity-100 transition-opacity ${!msg.admin ? 'right-0 text-slate-400' : 'left-0 text-slate-400'
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

                            {/* Reply Input */}
                            {selectedTicket.status !== 'CLOSED' ? (
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
                            ) : (
                                <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-slate-500 text-sm font-medium flex items-center justify-center gap-2">
                                    <Clock size={16} /> This ticket is closed. Please create a new ticket for other inquiries.
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
                                Choose a ticket from your history to view the conversation or check for updates.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Ticket Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <PlusCircle className="text-indigo-600" size={24} />
                                New Support Request
                            </h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTicket} className="p-8 space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subject</label>
                                <input
                                    type="text"
                                    value={newSubject}
                                    onChange={(e) => setNewSubject(e.target.value)}
                                    placeholder="e.g., Login Issue, Certificate Error"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all font-medium text-slate-800"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Please provide as much detail as possible..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 min-h-[150px] outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all resize-none text-slate-800"
                                    required
                                ></textarea>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-6 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    <Send size={18} />
                                    Submit Ticket
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentSupport;
