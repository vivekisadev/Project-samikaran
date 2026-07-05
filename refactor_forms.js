const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/admin/AdminApp.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const newConfirmModal = `const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, loading }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl border border-gray-100"
        >
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-6 mx-auto">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center leading-tight">{title}</h3>
          <p className="text-gray-500 text-sm text-center mt-3 leading-relaxed">{message}</p>
          <div className="grid grid-cols-2 gap-3 mt-8">
            <button 
              onClick={onCancel}
              className="py-3 rounded-xl bg-gray-50 text-gray-700 font-medium text-sm hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              disabled={loading}
              className="py-3 rounded-xl bg-red-500 text-white font-medium text-sm hover:bg-red-600 transition-colors shadow-sm flex items-center justify-center"
            >
              {loading ? <RefreshCcw className="animate-spin" size={18} /> : "Delete"}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const FormModal = ({ isOpen, title, onClose, children }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-3xl bg-white rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <X size={20} />
            </button>
          </div>
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);`;

// Replace ConfirmModal
content = content.replace(/const ConfirmModal =.*?\}\);/s, newConfirmModal);

// Now refactor all inline forms to use FormModal instead of AnimatePresence > motion.div > SpotlightCard
const formPattern1 = /<AnimatePresence>\s*\{isFormOpen && \(\s*<motion\.div[^>]*>\s*<SpotlightCard title=\{([^>]+)\}[^>]*>\s*(<form[\s\S]*?<\/form>)\s*<\/SpotlightCard>\s*<\/motion\.div>\s*\)\}\s*<\/AnimatePresence>/g;
content = content.replace(formPattern1, '<FormModal isOpen={isFormOpen} title={$1} onClose={cancelEdit}>\n            $2\n          </FormModal>');

// If there are forms inside just <div className="bg-white p-6 ..."> inside the motion.div
const formPattern2 = /<AnimatePresence>\s*\{isFormOpen && \(\s*<motion\.div[^>]*>\s*<div className="bg-white[^>]*>\s*<h3[^>]*>([^<]+)<\/h3>\s*(<form[\s\S]*?<\/form>)\s*<\/div>\s*<\/motion\.div>\s*\)\}\s*<\/AnimatePresence>/g;
content = content.replace(formPattern2, '<FormModal isOpen={isFormOpen} title={"$1"} onClose={cancelEdit}>\n            $2\n          </FormModal>');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Admin forms refactored to use FormModal');
