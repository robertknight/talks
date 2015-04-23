#include <QtCore/QDebug>

#include <QtGui/QFont>
#include <QtGui/QPainter>
#include <QtGui/QImage>

#include <QtGui/QGuiApplication>

#include <stdio.h>

int countNonWhitePixels(const QImage& img)
{
	int count = 0;
	for (int y = 0; y < img.height(); y++) {
		for (int x = 0; x < img.width(); x++) {
			if (QColor(img.pixel(x,y)).red() < 0.2) {
				++count;
			}
		}
	}
	return count;
}

int main(int argc, char** argv)
{
	QGuiApplication app(argc, argv);

	const int CHAR_SIZE = 20;

	QFont monoFont("monospace");
	monoFont.setPixelSize(CHAR_SIZE);

	QMap<int,QString> nonWhitePixels;

	for (int i=1; i < 127; i++)
	{
		QImage image(CHAR_SIZE, CHAR_SIZE, QImage::Format_ARGB32);
		image.fill(Qt::white);

		QPainter painter(&image);
		painter.setFont(monoFont);

		QChar ch(i);
		if (!ch.isPrint())
		{
			continue;
		}
		QString str;
		str.append(ch);
		painter.drawText(image.rect(), str);

		int count = countNonWhitePixels(image);
		if (!nonWhitePixels.contains(count))
		{
			nonWhitePixels[count] = str;
		}
	}

	QTextStream cout(stdout);
	QMapIterator<int,QString> iter(nonWhitePixels);
	while (iter.hasNext())
	{
		iter.next();
		qreal threshold = static_cast<qreal>(iter.key()) / 60.0;
		cout << "{" << threshold << " , '" << iter.value() << "'},\n";
	}

	return 0;
}

