'use client';

import { FaUserFriends, FaBriefcase, FaHome, FaQuestion } from 'react-icons/fa';

const ContactStats = ({ contacts }) => {
  const getGroupStats = () => {
    const stats = {
      'Friends': { count: 0, icon: FaUserFriends, color: 'bg-blue-100 text-blue-800', bgColor: 'bg-blue-50' },
      'Work': { count: 0, icon: FaBriefcase, color: 'bg-green-100 text-green-800', bgColor: 'bg-green-50' },
      'Family': { count: 0, icon: FaHome, color: 'bg-purple-100 text-purple-800', bgColor: 'bg-purple-50' },
    };

    contacts.forEach(contact => {
      if (stats[contact.group]) {
        stats[contact.group].count++;
      }
    });

    return stats;
  };

  const stats = getGroupStats();

  return (
    <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
      {Object.entries(stats).map(([group, data]) => {
        const IconComponent = data.icon;
        return (
          <div
            key={group}
            className={`${data.bgColor} rounded-lg p-4 border border-gray-200 transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{group}</p>
                <p className="text-2xl font-bold text-gray-900">{data.count}</p>
              </div>
              <div className={`p-3 rounded-full ${data.color}`}>
                <IconComponent className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactStats;
