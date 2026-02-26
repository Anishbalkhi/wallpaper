import React, { useEffect, useState } from 'react';
import { MoreHorizontal, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { postAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

const RecentUploadsWidget = () => {
    const { user } = useAuth();
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUploads = async () => {
            if (!user?._id) return;
            try {
                const res = await postAPI.getPosts({ author: user._id, limit: 5 });
                if (res.data?.success) {
                    setUploads(res.data.posts);
                }
            } catch (err) {
                console.error("Failed to fetch uploads", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUploads();
    }, [user]);

    if (loading) return <div className="p-6 bg-white rounded-[2rem] border border-gray-100 animate-pulse h-[300px]"></div>;

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-gray-900">Recent Uploads</h3>
                <Link to="/profile" className="text-sm text-blue-500 font-medium hover:text-blue-600 flex items-center gap-1">
                    View All <ArrowUpRight size={14} />
                </Link>
            </div>

            <div className="space-y-4">
                {uploads.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No uploads yet. Start selling!</p>
                ) : (
                    uploads.map(item => (
                        <div key={item._id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-900 truncate">{item.title}</h4>
                                <p className="text-xs text-gray-500">{item.category || 'Uncategorized'}</p>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">{item.views || 0} views</span>
                                    <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-medium">{item.sales || 0} sales</span>
                                </div>
                            </div>
                            <button className="text-gray-300 hover:text-gray-600">
                                <MoreHorizontal size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentUploadsWidget;
