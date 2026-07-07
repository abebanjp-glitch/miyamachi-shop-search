export const CATEGORIES = [
  'ショッピング',
  'グルメ＆スイーツ',
  'スーパー・食料品・お酒',
  '暮らしのサービス',
  '医療・薬局・美容・健康',
  '学ぶ・スクール',
  '遊ぶ・趣味・ビジネス'
];

export const AREAS = [
  '宮町',
  '東照宮',
  '小田原',
  '小松島',
  '花京院',
  '上杉',
  '中江',
  '梅田町',
  '福沢町',
  '高松',
  '錦町',
  'その他'
];

// Helper to get category colors
export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'ショッピング':
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        badge: 'bg-blue-600 text-white',
        iconColor: 'text-blue-600'
      };
    case 'グルメ＆スイーツ':
      return {
        bg: 'bg-pink-50 text-pink-700 border-pink-200',
        badge: 'bg-pink-600 text-white',
        iconColor: 'text-pink-600'
      };
    case 'スーパー・食料品・お酒':
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        badge: 'bg-amber-600 text-white',
        iconColor: 'text-amber-700'
      };
    case '暮らしのサービス':
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        badge: 'bg-emerald-700 text-white',
        iconColor: 'text-emerald-700'
      };
    case '医療・薬局・美容・健康':
      return {
        bg: 'bg-teal-50 text-teal-700 border-teal-200',
        badge: 'bg-teal-600 text-white',
        iconColor: 'text-teal-600'
      };
    case '学ぶ・スクール':
      return {
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        badge: 'bg-indigo-600 text-white',
        iconColor: 'text-indigo-600'
      };
    case '遊ぶ・趣味・ビジネス':
      return {
        bg: 'bg-purple-50 text-purple-700 border-purple-200',
        badge: 'bg-purple-600 text-white',
        iconColor: 'text-purple-600'
      };
    default:
      return {
        bg: 'bg-gray-50 text-gray-700 border-gray-200',
        badge: 'bg-gray-600 text-white',
        iconColor: 'text-gray-600'
      };
  }
};
