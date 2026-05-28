const AnalysisResultsModal = ({ analysis, onClose }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusConfig = {
    pending: { label: "Chờ xử lý", color: "bg-gray-100 text-gray-700" },
    running: { label: "Đang chạy", color: "bg-blue-100 text-blue-700" },
    completed: { label: "Hoàn thành", color: "bg-green-100 text-green-700" },
    failed: { label: "Thất bại", color: "bg-red-100 text-red-700" }
  };

  const status = statusConfig[analysis.status] || statusConfig.pending;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📊</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Kết quả phân tích</h2>
                <p className="text-sm text-gray-600">{analysis.document_title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                {status.label}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Thời gian</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(analysis.started_at)}
              </p>
            </div>
          </div>

          {/* Running State */}
          {analysis.status === "running" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Đang phân tích tài liệu...</p>
              <p className="text-sm text-gray-500 mt-2">Quá trình này có thể mất vài phút</p>
            </div>
          )}

          {/* Failed State */}
          {analysis.status === "failed" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">❌</div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Phân tích thất bại</h3>
              {analysis.error_message && (
                <p className="text-red-700">{analysis.error_message}</p>
              )}
            </div>
          )}

          {/* Completed State */}
          {analysis.status === "completed" && (
            <>
              {/* Summary */}
              {analysis.summary && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <span>📝</span>
                    <span>Tóm tắt</span>
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{analysis.summary}</p>
                  </div>
                </div>
              )}

              {/* Key Findings */}
              {analysis.key_findings && analysis.key_findings.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <span>🔍</span>
                    <span>Phát hiện quan trọng</span>
                  </h3>
                  <ul className="space-y-2">
                    {analysis.key_findings.map((finding, idx) => (
                      <li key={idx} className="flex items-start space-x-2 bg-blue-50 rounded-lg p-3">
                        <span className="text-blue-600 font-bold">{idx + 1}.</span>
                        <span className="text-gray-700">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Keywords */}
              {analysis.keywords && analysis.keywords.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <span>🏷️</span>
                    <span>Từ khóa</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Entities */}
              {analysis.extracted_entities && Object.keys(analysis.extracted_entities).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <span>🎯</span>
                    <span>Thực thể trích xuất</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(analysis.extracted_entities).map(([type, entities]) => (
                      <div key={type} className="bg-gray-50 rounded-lg p-4">
                        <p className="font-medium text-gray-900 mb-2 capitalize">{type}</p>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(entities) ? entities.map((entity, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-white border border-gray-200 rounded text-sm text-gray-700"
                            >
                              {entity}
                            </span>
                          )) : (
                            <span className="text-sm text-gray-600">{entities}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sentiment */}
              {analysis.sentiment && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <span>😊</span>
                    <span>Cảm xúc</span>
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 capitalize font-medium">{analysis.sentiment}</p>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Thông tin phân tích</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Bắt đầu</p>
                    <p className="font-medium text-gray-900">{formatDate(analysis.started_at)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Hoàn thành</p>
                    <p className="font-medium text-gray-900">{formatDate(analysis.completed_at)}</p>
                  </div>
                  {analysis.processed_by && (
                    <div>
                      <p className="text-gray-600">Xử lý bởi</p>
                      <p className="font-medium text-gray-900">{analysis.processed_by}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600">ID</p>
                    <p className="font-mono text-xs text-gray-600 truncate">{analysis.id}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Pending State */}
          {analysis.status === "pending" && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-3">⏸️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Đang chờ xử lý</h3>
              <p className="text-gray-600">Phân tích sẽ bắt đầu sớm</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResultsModal;
